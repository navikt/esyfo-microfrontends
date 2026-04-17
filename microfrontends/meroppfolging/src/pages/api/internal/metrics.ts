import { metricsRegistry } from "@esyfo/shared/metrics";
import type { APIRoute } from "astro";

export const GET: APIRoute = async function get() {
  return new Response(await metricsRegistry.metrics(), {
    status: 200,
    headers: {
      "Content-Type": metricsRegistry.contentType,
    },
  });
};
