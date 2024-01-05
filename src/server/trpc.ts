/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { Context } from './context';
import { initTRPC, TRPCError } from '@trpc/server';
import { OperationMeta } from 'openapi-trpc';
import superjson from 'superjson';
const t = initTRPC
  .meta<OperationMeta>()
  .context<Context>()
  .create({
    /**
     * @see https://trpc.io/docs/v10/data-transformers
     */
    transformer: superjson,
    /**
     * @see https://trpc.io/docs/v10/error-formatting
     */
    errorFormatter({ shape }) {
      return shape;
    },
  });

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const middleware = t.middleware;

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = t.mergeRouters;

const isAuthed = middleware(({ next, ctx }) => {
  const user = ctx.user;

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please log in' });
  }

  return next({
    ctx: {
      user,
    },
  });
});

/**
 * Protected base procedure
 */
export const authedProcedure = t.procedure.use(isAuthed);
