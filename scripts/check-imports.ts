#!/usr/bin/env bun
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

function findTsconfig(file: string): string | null {
	let current = dirname(file);
	while (true) {
		const tsconfigPath = join(current, "tsconfig.json");
		if (existsSync(tsconfigPath)) return current;
		const parent = dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}

function getPaths(tsconfigDir: string): Record<string, string[]> | null {
	try {
		const tsconfig = JSON.parse(
			readFileSync(join(tsconfigDir, "tsconfig.json"), "utf-8"),
		) as { compilerOptions?: { paths?: Record<string, string[]> } };
		return tsconfig.compilerOptions?.paths || null;
	} catch {
		return null;
	}
}

function findAlias(
	relPath: string,
	paths: Record<string, string[]>,
): string | null {
	let bestMatch: { alias: string; length: number } | null = null;
	for (const [key, targets] of Object.entries(paths)) {
		for (const target of targets) {
			if (target.startsWith("./") && target.endsWith("/*")) {
				const prefix = target.slice(2, -2); // remove ./ and /*
				if (relPath.startsWith(`${prefix}/`) || relPath === prefix) {
					const len = prefix.length;
					if (!bestMatch || len > bestMatch.length) {
						const aliasPrefix = key.slice(0, -2); // remove /*
						const remaining = relPath.slice(prefix.length).replace(/^\//, ""); // remove leading /
						bestMatch = { alias: `${aliasPrefix}/${remaining}`, length: len };
					}
				}
			}
		}
	}
	return bestMatch?.alias || null;
}

function getAliasPrefixes(paths: Record<string, string[]>): string[] {
	return Object.keys(paths).map((key) => key.replace("/*", "/"));
}

async function main() {
	const args = process.argv.slice(2);
	const fix = args.includes("--fix");
	const patterns = args.filter((arg) => !arg.startsWith("--"));

	if (patterns.length === 0) {
		patterns.push(".");
	}

	const files: string[] = [];
	for (const pattern of patterns) {
		const globPattern = pattern === "." ? "**/*.{ts,tsx}" : pattern;
		const glob = new Bun.Glob(globPattern);
		for await (const file of glob.scan()) {
			files.push(file);
		}
	}

	// Remove duplicates
	const uniqueFiles = [...new Set(files)];

	let hasErrors = false;
	const fixes: {
		file: string;
		lineIndex: number;
		oldLine: string;
		newLine: string;
	}[] = [];

	function computeCorrectImport(
		file: string,
		importPath: string,
		tsconfigDir: string | null,
		paths: Record<string, string[]> | null,
	): string {
		if (paths && tsconfigDir) {
			if (!importPath.startsWith(".")) return importPath; // external
			// Compute alias
			const fileDir = dirname(file);
			const absPath = resolve(fileDir, importPath);
			const relToBase = relative(tsconfigDir, absPath);
			const alias = findAlias(relToBase, paths);
			if (alias) return alias;
			// fallback to relative
			const rel = relative(fileDir, absPath);
			return rel.startsWith(".") ? rel : `./${rel}`;
		}

		// For files without paths, convert aliases to relative
		if (importPath.startsWith("~/") && tsconfigDir) {
			const local = importPath.slice(2);
			const target = join(tsconfigDir, local);
			const fileDir = dirname(file);
			let rel = relative(fileDir, target);
			if (!rel.startsWith(".")) rel = `./${rel}`;
			return rel;
		}
		if (importPath.startsWith("src/")) {
			// Assume src/ is relative to repo root or something, but for now, keep as is or compute
			// For simplicity, since agnostic, perhaps leave or assume relative to tsconfigDir
			if (tsconfigDir) {
				const target = join(tsconfigDir, importPath);
				const fileDir = dirname(file);
				let rel = relative(fileDir, target);
				if (!rel.startsWith(".")) rel = `./${rel}`;
				return rel;
			}
		}

		return importPath; // others unchanged
	}

	for (const file of uniqueFiles) {
		if (file.includes("routeTree.gen.ts")) continue; // Skip generated files
		if (![".ts", ".tsx"].includes(extname(file))) continue;

		const tsconfigDir = findTsconfig(file);
		const paths = tsconfigDir ? getPaths(tsconfigDir) : null;
		const hasPathsConfig = !!paths;
		const aliasPrefixes = paths ? getAliasPrefixes(paths) : [];

		const content = readFileSync(file, "utf-8");
		const lines = content.split("\n");

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const match = line.match(/^import.*from ["']([^"']+)["']/);
			if (!match) continue;

			const importPath = match[1];
			let isError = false;
			let errorMsg = "";

			if (hasPathsConfig) {
				if (importPath.startsWith(".")) {
					isError = true;
					errorMsg = "Use alias imports instead of relative imports";
				}
			} else {
				const isAlias = aliasPrefixes.some((prefix) =>
					importPath.startsWith(prefix),
				);
				if (isAlias) {
					isError = true;
					errorMsg = "Use relative imports instead of aliases";
				} else if (importPath.startsWith("src/")) {
					isError = true;
					errorMsg =
						"Use shortest relative imports instead of absolute src/ paths";
				}
			}

			if (isError) {
				hasErrors = true;
				if (fix) {
					const correctPath = computeCorrectImport(
						file,
						importPath,
						tsconfigDir,
						paths,
					);
					console.log("Fixing import in", `${file}:${i + 1}`);
					console.log("import", importPath, "->", correctPath);
					const newLine = line.replace(importPath, correctPath);
					fixes.push({ file, lineIndex: i, oldLine: line, newLine });
				} else {
					console.error(`Error in ${file}:${i + 1}: ${errorMsg}`);
				}
			}
		}
	}

	if (fix && fixes.length > 0) {
		for (const { file, lineIndex, newLine } of fixes) {
			const content = readFileSync(file, "utf-8");
			const lines = content.split("\n");
			lines[lineIndex] = newLine;
			writeFileSync(file, lines.join("\n"), "utf-8");
			console.log(`Fixed import in ${file}:${lineIndex + 1}`);
		}
	}

	if (hasErrors && !fix) {
		process.exit(1);
	}
}

main();
