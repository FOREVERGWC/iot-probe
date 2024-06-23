import SuperJSON from "superjson";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server";
import { createSWRProxyHooks } from "@trpc-swr/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/* tRPC Client */

export const api = createSWRProxyHooks<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ], // @ts-ignore
  // transformer: SuperJSON,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
