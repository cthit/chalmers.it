# chalmers.it

A rewrite and redesign of [chalmersit-rails](https://github.com/cthit/chalmersit-rails) in Next.js

## Suggestions and Contributions

Suggestions are very welcome, and if you wish to create one, please create an issue using one of the templates.
Contributions are also welcome, feel free to create a pull request with your changes.

# Building and Running

## Prerequisites

A few things are required to run the project:

1. [Node.js](https://nodejs.org/en/) v20 for running the web server
2. Docker for running other services
3. pnpm (installed with `npm install -g pnpm`)

## Development

In order to run the project in development mode, a few steps are required:

1. Install packages with `pnpm install`
2. Start services by running `docker compose up -d`
3. Set up the database by running `pnpm prisma generate` and `pnpm prisma db push`
4. Run `pnpm run dev` to start the development server

If you wish to modify anything in the database, the recommended way to go is to use Prisma Studio, which can be started by running `pnpm prisma studio`.

If you want to add images to the news posts, you need to create a folder in the root folder called "media" (otherwise an error will pop up), or whatever is defined in the MEDIA_PATH env variable. You also need to copy the image link and add it somewhere in the news post.

## Production Use

The easiest to run the project in production mode is to use the docker-compose file in the root of the project.
This will start all the services needed, and expose the web server on port 3000.

The project can also be compiled into a minimized file structure, which can be run with just Node.
This is done by running `pnpm run build`, which will build the project to `.next/standalone`.
Services will however be needed to be started separately.
The project is also compiled this way when building the docker image.

## Getting the correct GAMMA_API_KEY_ID and GAMMA_API_KEY_TOKEN

You need to be a Gamma admin. Go to https://auth.chalmers.it/api-keys/create and type a key name and description. In the drop down, select **"INFO"**.

DO NOT copy "Api key". Copy the string under "To authorize when doing API requests, simply add this header:" which will look something like **`Authorization: pre-shared a53b0390-xxx-xxxx-xxx-xxxxxx : xxxxxxxxx`**.

The part you need is the KEY_ID : KEY which is **`a53b0390-xxx-xxxx-xxx-xxxxxx : xxxxxxxxx`**. Store this in your .env file or somewhere local.

## Getting the correct GAMMA_CLIENT_ID and GAMMA_CLIENT_SECRET

As a Gamma admin, go to https://auth.chalmers.it/clients. It only works with official client, not user client because... reasons. Pick a name and description. **Set redirect url to** `http://localhost:3000/api/auth/callback/gamma` and add eventual restrictions. Copy the **client secret**, it will look something like `CR66SWjbwYHd8XXXxXXxXXXXxxxXX` Store it in your .env file or somewhere local. The **client ID** is shown in the client details and looks something like `TJFDH7H2E8USXXXXXXXX`.


## Environment Variables

This project uses environment variables to configure its behavior.

The following environment variables are used:

| Variable                  | Description                                                                                  | Example Value                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| DATABASE_URL              | Database connection URL                                                                      | `postgresql://postgres:postgres@localhost:5432/postgres?schema=public` |
| GAMMA_API_KEY_ID          | Gamma info API key ID                                                                        | `api-key-id-uuid-here`                                                 |
| GAMMA_API_KEY_TOKEN       | Gamma info API token                                                                         | `token`                                                                |
| GAMMA_CLIENT_ID           | Gamma OAuth client ID                                                                        | `id`                                                                   |
| GAMMA_CLIENT_SECRET       | Gamma OAuth client secret                                                                    | `secret`                                                               |
| GAMMA_ROOT_URL            | Gamma root URL                                                                               | `https://auth.chalmers.it`                                             |
| BASE_URL                  | URL that is used as a base for linking to news                                               | `https://chalmers.it`                                                  |
| NEXTAUTH_SECRET           | Secret used for signing cookies                                                              | `secret`                                                               |
| NEXTAUTH_URL              | URL to the NextAuth API                                                                      | `http://localhost:3000/api/auth`                                       |
| MEDIA_PATH                | Path to store media                                                                          | `./media`                                                              |
| ACTIVE_GROUP_TYPES        | Comma-separated list of group types that are considered active                               | `committee,society`                                                    |
| ADMIN_GROUPS              | Comma-separated list of groups that are considered admin groups                              | `styrit,digit`                                                         |
| PAGE_EDITOR_GROUPS        | Comma-separated list of groups that are allowed to edit division pages in addition to admins | `snit,motespresidit`                                                   |
| CORPORATE_RELATIONS_GROUP | Group that is considered the corporate relations group                                       | `armit`                                                                |
| MAX_PAGE_SIZE             | Max page size of paginated API endpoints                                                     | `50`                                                                   |
