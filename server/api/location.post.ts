import type { DrizzleError } from "drizzle-orm";

import db from "~~/lib/db";
import { InsertLocation, location } from "~~/lib/db/schema";
import { error } from "better-auth/api";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusText: "unauthorized",
    });
  }
  const result = await readValidatedBody(event, InsertLocation.safeParse);
  if (!result.success) {
    const statusMessage = result.error.issues.map(issues => `${issues.path.join()} : ${issues.message}`);
    const data = Object.fromEntries(
      result.error.issues.map(issue => [issue.path.join("."), issue.message]),
    );
    throw createError({
      statusCode: 422,
      statusText: `${statusMessage}`,
      data,
    });
  }

  const existingLocation = await db.query.location.findFirst({
    where:
    and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),

    ),
  });

  if (existingLocation) {
    throw createError({
      statusCode: 409,
      statusText: "A location with that name already exists!",

    });
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    }));
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      userId: event.context.user.id,
      slug,

    }).returning();
    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      throw createError({
        statusCode: 409,
        statusText: "Slug must be unique (the location name is used to generate the slug.)",
      });
    }
  }
  throw error;
});
