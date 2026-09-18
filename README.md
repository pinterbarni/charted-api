<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Charted BFF

Backend for Frontend service for the Charted hiking application / Built with NestJS, TypeORM, PostgreSQL and Keycloak.

## Table of Contents

- [Charted BFF](#charted-bff)
  - [Table of Contents](#table-of-contents)
  - [Stack](#stack)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [API Documentation](#api-documentation)
  - [Available Scripts](#available-scripts)
  - [Architecture](#architecture)
  - [Deployment](#deployment)
  - [Resources](#resources)
  - [Support](#support)
  - [License](#license)

## Stack

- **Framework**: NestJS v11
- **Language**: TS (strict)
- **Database**: PostgreSQL with PostGIS & TypeORM
- **Authentication**: Keycloak PKCE w. JWKS validation
- (**Routing**: Valhalla routing (proxied) ) todo
- **Tiles**: Martin tile server (proxied)
- **Logging**: Pino (structured JSON)
- **Documentation**: Compodoc + Swagger UI
- **Testing**: Jest

## Prerequisites

- Node.js v20+
- Docker
- Access to Vesta (Tailscale)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Fill in your values in .env

# Start dev db
npm run db:dev

# Start dev srv
npm run start:dev
```

## Environment Variables

See `.env.example` for all required variables.

## API Documentation

- **Swagger UI**: <http://localhost:3000/api/docs> -always on, as expected
- **Compodoc**: `npm run docs:serve` to <http://localhost:8080>

## Available Scripts

| Script                | Description                     |
| --------------------- | ------------------------------- |
| `npm run start:dev`   | Run dev server with watch mode  |
| `npm run build`       | Build for production            |
| `npm run start:prod`  | Start production srv            |
| `npm run db:dev`      | Run dev PostgreSQL container    |
| `npm run db:dev:down` | Stop dev PostgreSQL container   |
| `npm run db:dev:logs` | View db logs                    |
| `npm run docs`        | Generate Compodoc documentation |
| `npm run docs:serve`  | Serve Compodoc with live reload |
| `npm run seed:dev`    | Seed dev db                     |
| `npm run seed:prod`   | Seed production db              |
| `npm run lint`        | Run ESLint                      |
| `npm run test`        | Run unit tests                  |

## Architecture

```bash
Mobile App (RN)
⬇️
Janus (Pi) - nginx TLS + rate limiting
⬇️
Tailscale Vesta (Pi +)
⬇️
Charted BFF (You are here :D)
⬇️
PostgreSQL Martin tiles (Valhalla) routing
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
