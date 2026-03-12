import db from "~~/lib/db";
import { InsertLocation, location } from "~~/lib/db/schema";

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
  const [created] = await db.insert(location).values({
    ...result.data,
    userId: event.context.user.id,
    slug: result.data.name.replaceAll(" ", "-").toLowerCase(),

  }).returning();
  return created;
});
