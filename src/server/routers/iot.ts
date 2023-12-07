import { prisma } from '../prisma';
import { z } from 'zod';
import { authedProcedure, publicProcedure, router } from '../trpc';

import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;
if (!clientId) {
  throw new Error('clientId is undefined');
}
const redirectUri =
  process.env.NODE_ENV === 'production'
    ? 'https://chiral-phonon-material-database.vercel.app/api/authCallback'
    : 'http://localhost:3000/api/authCallback';

export const iotRouter = router({
  loginURL: publicProcedure.query(async () => {
    return workos.userManagement.getAuthorizationUrl({
      // Specify that we'd like AuthKit to handle the authentication flow
      provider: 'authkit',
      // The callback URI AuthKit will redirect to after authentication
      redirectUri: redirectUri,
      clientId,
    });
  }),
  managedDevice: authedProcedure.query(async ({ ctx }) => {
    const uid = ctx.user;
    return prisma.clients.findMany({
      where: {
        userID: uid,
      },
    });
  }),
  allDevice: publicProcedure.query(async () => {
    return prisma.clients.findMany();
  }),
  addDevice: authedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const uid = ctx.user;
      return prisma.clients.create({
        data: {
          ...input,
          userID: uid,
        },
      });
    }),
  updateDevice: authedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        type: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const uid = ctx.user;
      // use select to check if user is owner of device
      const device = await prisma.clients.findUnique({
        where: {
          id: input.id,
        },
      });
      if (device?.userID !== uid) {
        throw new Error('Unauthorized');
      }
      return prisma.clients.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
  deviceInfo: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.clients.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  deviceMessages: publicProcedure
    .input(
      z.object({
        id: z.number(),
        value: z.number().optional(),
        alert: z.boolean().optional(),
        start: z.date().optional(),
        end: z.date().optional(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.messages.findMany({
        where: {
          clientId: input.id,
          value: input.value,
          alert: input.alert,
          report: {
            gte: input.start,
            lte: input.end,
          },
        },
      });
    }),
});
