import { NextApiRequest, NextApiResponse } from 'next';
import { WorkOS } from '@workos-inc/node';
import { SignJWT } from 'jose';

const baseUri = process.env.APP_URL || 'http://localhost:3000';

const secret = new Uint8Array(
  Buffer.from(process.env.JWT_SECRET_KEY || '', 'base64'),
);

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID!;

export default async function handler(
  req: NextApiRequest,
  response: NextApiResponse,
) {
  // The authorization code returned by AuthKit
  const code = req.query.code as string;

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });

  // Cleanup params and redirect to homepage
  const url = new URL(req.url!, baseUri);
  // redirect to the homepage
  url.pathname = '/';
  // remove the code param
  url.searchParams.delete('code');
  // Create a JWT with the user's information
  const token = await new SignJWT({
    // Here you might look up and retrieve user details from your database
    user,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('11h')
    .sign(secret);

  // Store in a cookie
  response.setHeader(
    'Set-Cookie',
    `token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );

  response.redirect(url.toString());
}
