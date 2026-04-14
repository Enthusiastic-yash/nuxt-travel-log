import { remoteLocationBySlug } from "~~/lib/db/queries/location";

import defineAuthenticatedEventHandler from "~/utils/define-auth-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const deleted = await remoteLocationBySlug(slug, event.context.user.id);
  if (!deleted) {
    return sendError(event, createError({
      statusCode: 404,
      statusText: "Location not found",

    }));
  }
  setResponseStatus(event, 204);
});
