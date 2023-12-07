import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../server/routers/_app';

export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
