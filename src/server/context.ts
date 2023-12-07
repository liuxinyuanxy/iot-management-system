import * as trpcNext from '@trpc/server/adapters/next';
import { jwtVerify } from 'jose';
import { User } from '@workos-inc/node';

const secret = new Uint8Array(
  Buffer.from(process.env.JWT_SECRET_KEY || '', 'base64'),
);
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  const token = opts.req.cookies.token;
  if (!token) {
    return {
      user: null,
    };
  }
  const { payload } = await jwtVerify<User>(token, secret);
  return {
    user: (payload.user as User).id,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
