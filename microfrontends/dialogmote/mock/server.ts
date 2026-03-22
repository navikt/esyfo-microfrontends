import { addDaysToDate } from "@esyfo/shared/dateUtils";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  createAvlysningsBrev,
  createInnkallingsBrev,
  createReferatBrev,
  createReferatEndretBrev,
} from "./fixtures/factories/brev.ts";

const api = new Hono();
const port = 3000;

api.use("/*", cors({ origin: "http://localhost:4321", credentials: true }));

api.get("/api/dialogmote", (c) => {
  return c.json([
    createInnkallingsBrev({
      createdAt: addDaysToDate(new Date(), -10).toISOString(),
    }),
    createAvlysningsBrev({
      createdAt: addDaysToDate(new Date(), -6).toISOString(),
    }),
    createInnkallingsBrev({
      createdAt: addDaysToDate(new Date(), -5).toISOString(),
    }),
    createReferatBrev({
      createdAt: addDaysToDate(new Date(), -4).toISOString(),
    }),
    createInnkallingsBrev({
      createdAt: addDaysToDate(new Date(), -3).toISOString(),
    }),
    createReferatEndretBrev({
      createdAt: addDaysToDate(new Date(), -103).toISOString(),
    }),
  ]);
});

console.info(
  `\x1b[42m mock \x1b[0m dialogmote mock server is running on port ${port}`,
);

serve({
  fetch: api.fetch,
  port: port,
});
