import type { NominatimResult } from "~~/lib/types";

import { SearchSchema } from "~~/lib/zod-schema";

import defineAuthenticatedEventHandler from "~/utils/define-auth-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);
    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "nuxt-travel-log | ykashyap102@gmail.com",
        },
      });

      if (!response.ok) {
        throw createError({
          statusCode: 509,
          statusText: "Unable to reach search Api.",
        });
      }
      const data = (await response.json()) as NominatimResult[];

      if (!data.length) {
        throw createError({
          statusCode: 404,
          statusMessage: "No results found",
        });
      }

      return data;
    }
    catch {
      throw createError({
        statusCode: 404,
        statusMessage: "No results found",
      });
    }
  }, {
    maxAge: 60 * 60 * 24,
    name: "search-nominatim",
    getKey: (event) => {
      const query = getQuery(event);
      return query.q?.toString() || "";
    },

  }),
);
