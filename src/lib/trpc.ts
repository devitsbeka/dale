import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "@/server/root";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
});

export function getTRPCLinks() {
  return [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ];
}
