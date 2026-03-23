import type { H3Event } from "h3";
import type { ZodError } from "zod";

export default function sendZodError(event: H3Event, error: ZodError) {
  const statusMessage = error.issues.map(issues => `${issues.path.join()} : ${issues.message}`);
  const data = Object.fromEntries(
    error.issues.map(issue => [issue.path.join("."), issue.message]),
  );
  throw createError({
    statusCode: 422,
    statusText: `${statusMessage}`,
    data,
  });
}
