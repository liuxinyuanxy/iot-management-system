import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  response: NextApiResponse,
) {
  // redirect to the homepage
  // clear cookie
  response.setHeader(
    'Set-Cookie',
    `token=; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );
  // return a empty json
  response.json({});
}
