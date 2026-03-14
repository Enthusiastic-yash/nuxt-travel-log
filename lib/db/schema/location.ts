import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),

}, t => [unique().on(t.name, t.userId)]);

export const InsertLocation = createInsertSchema(location, {
  name: field => field.min(1, "Name is required").max(100),
  description: field => field.max(100),
  lat: field =>
    field
      .nullable()
      .refine(val => val !== null, "Latitude is required")
      .refine(val => val === null || val >= -90, "Number must be less than or equal to -90")
      .refine(val => val === null || val <= 90, "Number must be less than or equal to 90"),

  long: field =>
    field
      .nullable()
      .refine(val => val !== null, "Longitude is required")
      .refine(val => val === null || val >= -180, "Number must be less than or equal to -180")
      .refine(val => val === null || val <= 180, "Number must be less than or equal to 180"),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
