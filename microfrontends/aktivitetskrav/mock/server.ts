import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fixtures from "./fixtures";

const api = new Hono();
const port = 4000;

api.use("/*", cors({ origin: "http://localhost:4321", credentials: true }));

api.get("/api/aktivitetsplikt", (c) => {
  return c.json(fixtures.forhaandsvarselVurdering);
});

console.info(
  `\x1b[42m mock \x1b[0m aktivitetskrav mock server is running on port ${port}`,
);

serve({
  fetch: api.fetch,
  port: port,
});
