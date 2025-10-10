import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAvlysningsBrev, createInnkallingsBrev, createReferatBrev, createReferatEndretBrev } from "./data/brev";
import { ingenMotebehov } from "./data/ingenMotebehov";
import { motebehovMedSvar } from "./data/motebehovMedSvar";
import { motebehovUtenSvar } from "./data/motebehovUtenSvar";

const innkalt = createInnkallingsBrev();
const avlyst = createAvlysningsBrev();
const referat = createReferatBrev();
const referatEndret = createReferatEndretBrev();

const api = new Hono();

// Enable CORS for all routes
api.use(
  "/*",
  cors({
    origin: "http://localhost:4321",
    credentials: true,
  }),
);

api.get("/api/dialogmote", (c) => {
  return c.json(innkalt);
});

api.get("/api/motebehov", (c) => {
  return c.json(motebehovUtenSvar);
});

serve(api);
