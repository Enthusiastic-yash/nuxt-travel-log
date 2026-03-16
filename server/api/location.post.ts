import type { DrizzleError } from "drizzle-orm";

import { findLocationByName, findUniqueSlug, insertLocation } from "~~/lib/db/queries/location";
import { InsertLocation } from "~~/lib/db/schema";
import { error } from "better-auth/api";
import slugify from "slug";

import defineAuthenticatedEventHandler from "~/utils/define-auth-handler";

export default defineAuthenticatedEventHandler(async (event) => {
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

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    throw createError({
      statusCode: 409,
      statusText: "A location with that name already exists!",

    });
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertLocation(result.data, slug, event.context.user.id);
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
