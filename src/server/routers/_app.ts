/**
 * This file contains the root router of your tRPC-backend
 */
import { router, publicProcedure } from '../trpc';
import { iotRouter } from './iot';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  iot: iotRouter,
});

export type AppRouter = typeof appRouter;
