import type {
	BuildQueryResult,
	DBQueryConfig,
	ExtractTablesWithRelations,
} from "drizzle-orm";
import type * as schema from "../drizzle/schemas";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
	"one" | "many",
	boolean,
	TSchema,
	TSchema[TableName]
>["with"];

// https://github.com/drizzle-team/drizzle-orm/issues/695#issuecomment-1881454650
export type InferResultType<
	TableName extends keyof TSchema,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
	TSchema,
	TSchema[TableName],
	{
		with: With;
	}
>;
