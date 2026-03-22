---
applyTo: "**/*.astro,**/astro.config.mjs,**/middleware/**/*.ts,**/pages/**/*.ts,**/pages/**/*.astro"
---

# Astro SSR Patterns

## Component Structure (.astro files)

Astro components have two sections separated by `---` fences:

```astro
---
// Frontmatter: server-side TypeScript
// - Imports
// - Token exchange + data fetching
// - Business logic
import { fetchBrev } from "@src/utils/fetch";
import type { BrevDto } from "@schema/brevSchema";

const userToken = Astro.locals.token;
const brev: BrevDto[] = await fetchBrev(userToken);
---

<!-- Template: HTML + Astro components + React islands -->
<div class="dialogmote-microfrontend">
  <MyComponent data={brev} />
</div>
```

- **Frontmatter** runs on the server — safe to use tokens, call backends, access secrets
- **Template** renders to HTML — use Astro components for static content, React islands for interactivity

## Server-Side Data Fetching

All backend data is fetched in frontmatter using OBO tokens:

```astro
---
import { requestOboToken } from "@navikt/oasis";
import { BACKEND_API_URL, BACKEND_CLIENT_ID } from "astro:env/server";

const userToken = Astro.locals.token;
const oboResult = await requestOboToken(userToken, BACKEND_CLIENT_ID);

if (!oboResult.ok) {
  return new Response("Token exchange failed", { status: 503 });
}

const response = await fetch(`${BACKEND_API_URL}/api/endpoint`, {
  headers: { Authorization: `Bearer ${oboResult.token}` },
});
const data = await response.json();
---
```

**Pattern**: Token comes from `Astro.locals.token` (set by middleware) → exchange via `requestOboToken` → call backend with OBO token.

## Islands (Client-Side React)

Use `client:only="react"` for interactive components:

```astro
---
import MyReactComponent from "@src/components/MyComponent.tsx";
---
<MyReactComponent client:only="react" someProp={data} />
```

- **Minimize client islands** — server-render everything that doesn't need interactivity
- React is NOT bundled — it's loaded via import map from NAV CDN (`importmap.json`)
- Only pass serializable props to client components
- **Prefer React `.tsx` for presentation components** — Astro pages handle server logic (token exchange, data fetching), React components handle all presentation. This enables Storybook, Testing Library, and leverages the team's React expertise.

## Env Schema (astro:env/server)

Server secrets are defined in `astro.config.mjs`:

```javascript
env: {
  schema: {
    BACKEND_API_URL: envField.string({
      context: "server",
      access: "secret",
      default: "http://localhost:3000/api/backend",
    }),
    BACKEND_CLIENT_ID: envField.string({
      context: "server",
      access: "secret",
      default: "dev-gcp:team-name:app-name",
    }),
  },
},
```

Import in code: `import { BACKEND_API_URL } from "astro:env/server";`

## Middleware

Token validation in `src/middleware/index.ts`:

```typescript
import { getToken, validateTokenxToken } from "@navikt/oasis";
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const token = getToken(context.request.headers);

  if (isLocal) return next();           // Skip in development
  if (isInternal(context)) return next(); // Skip for health endpoints

  if (!token) return new Response(null, { status: 401 });

  const validation = await validateTokenxToken(token);
  if (!validation.ok) return new Response(null, { status: 401 });

  context.locals.token = token;
  return next();
});
```

## Pages & Routing

```
src/pages/
├── index.astro                    # Redirect to default locale
├── [locale]/
│   ├── index.astro                # Main page (data fetching + rendering)
│   └── fallback.astro             # Error/fallback state
└── api/
    └── internal/
        ├── isAlive.ts             # Liveness probe
        └── isReady.ts             # Readiness probe
```

- i18n configured in `astro.config.mjs` with `prefixDefaultLocale: true`
- Locales: `nb` (default), `nn`, `en`

## CSS in Astro

### Prefix Selector
Each microfrontend has a unique CSS prefix configured in `astro.config.mjs`:

```javascript
prefixer({
  prefix: ".dialogmote-microfrontend",
  ignoreFiles: [/module.css/],  // CSS modules are NOT prefixed
})
```

### CSS Modules
Use `.module.css` for component-scoped styles:
```astro
---
import styles from "@src/styles/index.module.css";
---
<div class={styles.wrapper}>...</div>
```

### Aksel CSS
Import once in the main page: `import "@src/styles/aksel.css";`

## Error Handling

Return `Response` objects from frontmatter for error states:

```astro
---
try {
  const data = await fetchData(token);
} catch (error) {
  logger.error({ error }, "Error fetching data");
  return new Response("Internal Server Error", { status: 503 });
}
---
```

## Boundaries

### ✅ Always
- Fetch data server-side in frontmatter
- Use `astro:env/server` for secrets
- Wrap backend calls in try/catch with logging
- Return appropriate HTTP status codes on error
- Keep the CSS prefix class on the root wrapper element

### 🚫 Never
- Use `getStaticPaths` (this is SSR, not SSG)
- Expose server secrets via client-accessible env vars
- Fetch data client-side against NAV backends
- Import heavy libraries into client islands (React is via import map)
