import { Link } from "@react-email/components";
import { LogoWordmark } from "./logo-wordmark";

export function Logo() {
	return (
		<Link
			aria-label="Go to acme.com"
			className="flex items-center font-bold text-gray-950 no-underline"
			href="https://acme.com"
		>
			<LogoWordmark className="h-4" />
			<span className="sr-only">ACME.com</span>
		</Link>
	);
}
