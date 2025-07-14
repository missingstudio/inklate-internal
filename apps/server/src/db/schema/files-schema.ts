import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizations, users } from "./auth-schema";

export const files = pgTable("files", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  creatorId: text("creator_id")
    .references(() => users.id)
    .references(() => organizations.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  data: jsonb("data"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
});
