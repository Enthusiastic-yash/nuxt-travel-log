import { findLocation } from "~~/lib/db/queries/location";

import defineAuthenticatedEventHandler from "~/utils/define-auth-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);
  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusText: "Location not Found",

    }));
  }
  return location;
});
