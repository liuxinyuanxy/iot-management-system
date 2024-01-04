# A iot management system written by Prisma + tRPC + Nextjs

## Features

- ♂️ E2E type safety with [tRPC](https://trpc.io)
- ⚡ Full-stack React with Next.js
- ⚡ Database with Prisma
- 🔐 Authorization using authkit
- 🎨 ESLint + Prettier

## Deployment

> The local version of the app uses mariaDB/mySQL, but the deployed version uses PostgreSQL.
> The psql version code is on my [github](https://github.com/liuxinyuanxy/iot-management-system)

### Vercel (already deployed)

https://iot-management-system.vercel.app/

### Using Docker

### Using [Render](https://render.com/)

The project contains a [`render.yaml`](./render.yaml) [_"Blueprint"_](https://render.com/docs/blueprint-spec) which makes the project easily deployable on [Render](https://render.com/).

The database is setup with a `starter` plan, but you can use a free plan for 90 days.

Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints) and connect to this Blueprint and see how the app and database automatically gets deployed.

You will either need to create an environment group called `trpc` with environment variables or remove that from `render.yaml` in favor of manual environment variables that overrides the ones in `/.env`.


## Commands

```bash
pnpm build      # runs `prisma generate` + `prisma migrate` + `next build`
pnpm db-nuke    # resets local db
pnpm dev        # starts next.js
pnpm dx         # starts postgres db + runs migrations + seeds + starts next.js
```
