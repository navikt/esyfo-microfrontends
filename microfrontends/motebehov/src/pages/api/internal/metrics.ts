import { handleMetricsRequest } from "@esyfo/shared/metrics";
import type { APIRoute } from "astro";

export const GET: APIRoute = () => handleMetricsRequest();
