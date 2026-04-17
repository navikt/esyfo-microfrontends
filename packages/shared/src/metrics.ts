import { Counter, collectDefaultMetrics, Registry } from "prom-client";

type RenderType = "success" | "fallback";
type MicrofrontendName = "dialogmote" | "aktivitetskrav" | "meroppfolging";

type MetricsState = {
  registry: Registry;
  microfrontendRenderCounter: Counter<"type" | "microfrontend">;
};

const globalMetrics = globalThis as typeof globalThis & {
  __esyfoMetrics__?: MetricsState;
};

function createMetricsState(): MetricsState {
  const registry = new Registry();

  collectDefaultMetrics({ register: registry });

  const microfrontendRenderCounter = new Counter({
    name: "microfrontend_renders_total",
    help: "Counts rendered microfrontends by render type",
    labelNames: ["type", "microfrontend"],
    registers: [registry],
  });

  return {
    registry,
    microfrontendRenderCounter,
  };
}

const metricsState = globalMetrics.__esyfoMetrics__ ?? createMetricsState();

globalMetrics.__esyfoMetrics__ = metricsState;

export const metricsRegistry = metricsState.registry;
export const microfrontendRenderCounter =
  metricsState.microfrontendRenderCounter;

export function incrementMicrofrontendRender(
  microfrontend: MicrofrontendName,
  type: RenderType,
) {
  microfrontendRenderCounter.inc({ microfrontend, type });
}
