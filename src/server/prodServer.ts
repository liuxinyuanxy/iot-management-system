import next from 'next';
import { createServer } from 'node:http';
import { parse } from 'node:url';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    if (!req.url) return;
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  });

  server.listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  );
});
