# chalmers.it

An ongoing rewrite of [chalmersit-rails](https://github.com/cthit/chalmersit-rails) in Next.js

## Suggestions and Contributions

Suggestions are very welcome, and if you wish to create one, please create an issue using one of the templates.
Contributions are also welcome, feel free to create a pull request with your changes.

# Building and running

## Prerequisites

A few things are required to run the project:

1. [Node.js](https://nodejs.org/en/) v20 for running the web server
2. Docker for running other services
3. pnpm (installed with `npm install -g pnpm`)

## Development

In order to run the project in development mode, a few steps are required:

1. Install packages with `pnpm install`
2. Start services by running `docker-compose -f docker-compose.dev.yml up -d`
3. Set up the database by running `pnpm prisma generate` and `pnpm prisma db push`
4. Run `pnpm run dev` to start the development server

If you wish to modify anything in the database, the recommended way to go is to use Prisma Studio, which can be started by running `pnpm prisma studio`.

## Production use

The easiest to run the project in production mode is to use the docker-compose file in the root of the project.
This will start all the services needed, and expose the web server on port 3000.

The project can also be compiled into a minimized file structure, which can be run with just Node.
This is done by running `pnpm run build`, which will build the project to `.next/standalone`.
Services will however be needed to be started separately.
The project is also compiled this way when building the docker image.

## UTF-8 symbols

There is a known issue where `pino-pretty` handles UTF-8 symbols incorrectly on Windows.
For example, checkmarks may display as `Ô£ô` instead of `✓`.
Should these symbols appear, change the current code page to UTF-8 by running `chcp 65001` in the terminal that will be used to run the project.
