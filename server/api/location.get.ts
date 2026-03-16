import { findLocations } from "~~/lib/db/queries/location";

import defineAuthenticatedEventHandler from "~/utils/define-auth-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  return await findLocations(event.context.user.id);
});
