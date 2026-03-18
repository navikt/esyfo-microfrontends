import { getToken, validateTokenxToken } from "@navikt/oasis";
import { logger } from "@navikt/pino-logger";
import { defineMiddleware } from "astro/middleware";
import { isInternal, isLocal } from "./environment.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  const token = getToken(context.request.headers);

  if (isLocal) {
    return next();
  }

  if (isInternal(context)) {
    return next();
  }

  if (!token) {
    return new Response(null, { status: 401 });
  }

  const validation = await validateTokenxToken(token);

  if (!validation.ok) {
    logger.error(
      { errorType: validation.errorType },
      "Invalid JWT token found",
    );
    return new Response(null, { status: 401 });
  }

  context.locals.token = token;

  return next();
});
