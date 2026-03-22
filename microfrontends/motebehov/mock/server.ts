import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { motebehovUtenSvar } from "./fixtures/motebehovUtenSvar.ts";

const api = new Hono();
const port = 3000;

api.use("/*", cors({ origin: "http://localhost:4321", credentials: true }));

api.get("/api/motebehov", (c) => {
  return c.json(motebehovUtenSvar);
});

console.info(
  `\x1b[42m mock \x1b[0m motebehov mock server is running on port ${port}`,
);

serve({
  fetch: api.fetch,
  port: port,
});
