import { findLocation, findLocationByName, updateLocationBySlug } from "~~/lib/db/queries/location";
import { InsertLocation } from "~~/lib/db/schema";

import defineAuthenticatedEventHandler from "~/utils/define-auth-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;

  const result = await readValidatedBody(event, InsertLocation.safeParse);
  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation && existingLocation.slug !== slug) {
    return sendError(event, createError({
      statusCode: 409,
      statusText: "A location with that name already exists!",

    }));
  }

  // const location = await findLocation(slug, event.context.user.id);
  // if (!location) {
  //   return sendError(event, createError({
  //     statusCode: 404,
  //     statusText: "Location not Found",

  //   }));
  // }
  return updateLocationBySlug(result.data, slug, event.context.user.id);
});
