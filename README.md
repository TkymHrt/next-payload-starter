# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick start - local setup

Use mise to pin the toolchain and drive the common workflows. Requirements: Docker + Docker Compose and mise installed (for example, `curl https://mise.run | sh`).

1. Trust and install the pinned tools:

```
mise trust
mise install
```

2. Copy environment variables and set your secrets:

```
cp .env.example .env
# edit PAYLOAD_SECRET and DATABASE_URI as needed
```

3. Start the stack (PostgreSQL + Next.js/Payload dev server):

```
mise run dev
```

This command brings up Docker Compose, installs dependencies with the Bun lockfile, and runs the dev server. Other helpful tasks:

- `mise run dev:db` / `mise run dev:db:stop` to start or stop only the database
- `mise run reset:db` to recreate the development database
- `mise run prod:up` / `mise run prod:down` / `mise run reset:db:prod` for the production compose stack

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
