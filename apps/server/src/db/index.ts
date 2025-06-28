import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "~/db/schema";
import postgres from "postgres";

export function getDb(databaseUrl: string) {
  const queryClient = postgres(databaseUrl, { ssl: false });
  return drizzle({ client: queryClient, schema });
}

export type DB = ReturnType<typeof getDb>;
