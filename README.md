# TaskGroup - Project Management Platform

A modern project management platform built with Next.js and NestJS, using a monorepo architecture with Turborepo.

## Project Overview

TaskGroup is a comprehensive project management solution that allows teams to collaborate, manage tasks, and communicate effectively. The platform features user authentication, project management, and real-time messaging capabilities.

## Technology Stack

This project is built using modern technologies and follows a monorepo structure:

### Apps

- `web`: A Next.js application that serves as the frontend, featuring:
    - User authentication (login/register)
    - Dashboard for project management
    - Account settings
    - Inbox for communications
    - Responsive design with custom components

- `api`: A NestJS application that serves as the backend API

### Packages

- `database`: Prisma ORM setup and database schema
- `ui`: Shared React component library
- `eslint-config`: Shared ESLint configurations
- `typescript-config`: Shared TypeScript configurations
- `schemas`: Shared data validation schemas

## Development Stack

- **Frontend**: Next.js with TypeScript
- **Backend**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Custom components with Radix UI
- **Styling**: Tailwind CSS
- **Package Management**: npm
- **Build Tool**: Turborepo

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Mangeh04/TSW.git
cd taskgroup
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables (check .env.example in each app)

4. Start the development servers:

```bash
npm run dev
```

This will start both the frontend and backend applications in development mode.

## Project Structure

- `/apps`
    - `/web` - Next.js frontend application
    - `/api` - NestJS backend application
- `/packages`
    - `/database` - Prisma schema and database utilities
    - `/ui` - Shared UI components
    - `/schemas` - Shared validation schemas
    - `/eslint-config` - Shared ESLint configurations
    - `/typescript-config` - Shared TypeScript configurations

## Scripts

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications and packages
- `npm run lint` - Run ESLint across the entire monorepo
- `npm run test` - Run tests across the entire monorepo

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
