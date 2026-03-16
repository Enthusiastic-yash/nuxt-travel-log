import type { UserWithId } from "~~/lib/auth";
import type { H3Event } from "h3";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

export default function defineAuthenticatedEventHandler<T>(handler: (event: AuthenticatedEvent) => T) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      throw createError({
        statusCode: 401,
        statusText: "unauthorized",
      });
    }
    return handler(event as AuthenticatedEvent);
  });
}
