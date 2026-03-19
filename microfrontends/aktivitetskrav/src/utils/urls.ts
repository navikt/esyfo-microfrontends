type EnvUrl = { development: string; production: string; local: string };

const AKTIVITETSKRAV_URL: EnvUrl = {
  local: "http://localhost:3000/?aktivitetsplikt-url",
  development: `https://www.intern.dev.nav.no/syk/aktivitetskrav`,
  production: `https://www.nav.no/syk/aktivitetskrav`,
};

const isProduction = window.location.href.includes("www.nav.no");
const isDevelopment = window.location.href.includes("intern.dev.nav.no");

export const getEnvironment = (): "production" | "development" | "local" => {
  if (isProduction) {
    return "production";
  }

  if (isDevelopment) {
    return "development";
  }

  return "local";
};

export const aktivitetskravUrl = AKTIVITETSKRAV_URL[getEnvironment()];
