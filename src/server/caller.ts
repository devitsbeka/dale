import { createCaller } from "./root";
import { createTRPCContext } from "./trpc";

export async function getServerCaller() {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
}
