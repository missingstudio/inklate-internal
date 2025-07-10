import { createTRPCContext } from "@trpc/tanstack-react-query";
import { AppRouter } from "@inklate/server/trpc";

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
