import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "packages/shared",
  "microfrontends/dialogmote",
  "microfrontends/motebehov",
  "microfrontends/aktivitetskrav",
]);
