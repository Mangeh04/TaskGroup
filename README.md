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
