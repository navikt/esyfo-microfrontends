import { Counter, collectDefaultMetrics, Registry } from "prom-client";

type RenderType = "success" | "fallback";
type MicrofrontendName = "dialogmote" | "aktivitetskrav" | "meroppfolging";

const registry = new Registry();

collectDefaultMetrics({ register: registry });

const renderCounter = new Counter({
  name: "esyfo_microfrontends_renders_total",
  help: "Counts rendered microfrontends by render type",
  labelNames: ["type", "microfrontend"],
  registers: [registry],
});

export const metricsRegistry = registry;
export { renderCounter };

export function incrementRender(
  microfrontend: MicrofrontendName,
  type: RenderType,
) {
  renderCounter.inc({ microfrontend, type });
}

export async function handleMetricsRequest(): Promise<Response> {
  return new Response(await metricsRegistry.metrics(), {
    status: 200,
    headers: {
      "Content-Type": metricsRegistry.contentType,
    },
  });
}
