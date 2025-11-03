# Template

This repository is a template repository to use the following stack:

- Package manager: Bun
- Monorepo: Bun workspaces
- Frontend: Tanstack Router
- Backend: Hono + oRPC
- Deployment: Cloudflare Workers
- Database: Drizzle + D1
- KV: Cloudflare KV
- i18n: Lingui.Dev
- Others: Cloudflare Images, Cloudflare R2, Cloudflare Queues, Cloudflare Scheduler/Cron

## Setup

Once you cloned this repository you'll need to setup your repo to deploy on Cloudflare.

1. Login with wrangler

The first step is to sign in with Wrangler CLI to be able to use your cloudflare resources.

```sh
cd app
bun wrangler login
```

Follow the instructions.

2. Create a Queue

Go to "Cloudflare > BUILD > Queues" and click "Create Queue".
Type the name of your queue, it should match the name you specified in your `./app/wrangler.jsonc`, in my case it's `acme-app-dev-default`.

3. Deploy your worker

Let's deploy the worker to Cloudflare. This will create all the necessary bindings we prepared in the `./app/wrangler.jsonc` configuration.
If you already have created these resources, you can specify their ID in the `./app/wrangler.jsonc` configuration instead.

```sh
cd app
bun run deploy:dev
```

If you didn't specify the bindings resources IDs it should have generated them for you, you can now copy them in your `./app/wrangler.jsonc`.

Here's an example output:

```sh
Your Worker has access to the following bindings:
Binding                                                             Resource
env.CACHE (292808e7b4704960b9c014ed965c77af)                        KV Namespace
env.DEFAULT_QUEUE (acme-app-dev-default)                            Queue
env.DB (br4fcabc-25ae-4c74-beaf-4516410b240a)                       D1 Database
env.BUCKET (acme-app-dev (eu))                                      R2 Bucket
env.IMAGES                                                          Images
env.ASSETS                                                          Assets
env.CF_VERSION_METADATA                                             Worker Version Metadata
env.NO_COLOR ("true")                                               Environment Variable
```

The IDs that we need is the `env.DB` & `env.CACHE`, you can copy them in the wrangler config like this:

```jsonc
{
  // ...,
  "d1_databases": [
    {
      "binding": "DB",
      "database_id": "bc4fcabc-25ae-4c74-beaf-4516410b240a", // See README for how to set this up
      "remote": true,
      "migrations_dir": "../data/drizzle/migrations"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "292808e7b4704960b9c014ed965c77af", // See README for how to set this up
      "remote": true
    }
  ],
}
```

4. Get your R2 public URL

Go to your Cloudflare Dashboard and browse to "BUILD > Storage & Databases > R2 object storage" and select the Bucket that is bound to your worker (`acme-app-dev` by default).

Go to Settings and Enable the Public Development URL. Once enables it should show up and look like `https://pub-{ID}.r2.dev`.

Copy that value into your `./app/wrangler.jsonc` config's `vars` (`BUCKET_PUBLIC_URL`).

5. Setup your .env files & secrets

### App environment
Copy `./app/.env.example` to `./app/.env`.

Edit the variables:

```sh
BETTER_AUTH_SECRET=secret
RESEND_API_KEY=re_123
```

Generate a secret for better auth & setup your Resend API key.

You'll also need to set these secrets in your worker config on the Cloudflare Dashboard.

Go into your Cloudflare Dashboard and browse to BUILD > Compute & AI > Workers & Pages and open your worker (by default `acme-app-dev`).

Go to settings and click "Add" in "Variables and Secrets" and add the two secrets as Type = "Secret" then run Deploy or Save.

### Data environment

We also need to setup the environment for the data package.

Copy `./data/.env.example` to `./data/.env` & set the correct values.

The `CLOUDFLARE_DATABASE_ID` should match the created DB ID (`bc4fcabc-25ae-4c74-beaf-4516410b240a` in this case).
The `CLOUDFLARE_D1_TOKEN` should be a Cloudflare API Token with at least D1 Edit permissions.

Now let's apply the migrations to the database.

```sh
cd ./data
bun run db:migrate
```

6. Worker types

Now that everything is setup in your config you can generate the bindings types with `bun run cf-typegen`.

## Usage

You app is now ready.

Run `bun run dev` from the `./app` directory and browse to `http://localhost:3000`.

You can create an account & then use the app.

## Typescripts Monorepo

This monorepo is built with composite typescript projects.

This means you don't need to build the packages to use them in another workspace.
In this case, we don't need to build @acme/data to use it in @acme/app. This greatly improves the DX.
The downside is that sometimes you won't be able to infer types on complex libraries. We have the example in this case with Better Auth. ([See this issue for reference](https://github.com/microsoft/TypeScript/issues/43817#issuecomment-827746462))

In `/data/src/auth.tsx` you have to explicitely type the return values of the functions, especially if you enable more plugins.

Another downside to this is that you can't use path aliases inside the composite package you app depends on. It'll throw an error when building the app.
That's why I have a `bun check:imports` script at the root of the monorepo that enforces that. It's probably not a perfect script so use with care.
