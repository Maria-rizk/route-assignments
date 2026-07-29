# Social Media App (API)

A local-first social media backend: authentication, posts, comments, reactions,
direct/group chat over WebSockets, notifications, and a GraphQL endpoint for
posts/users - built with Express, TypeScript, MongoDB (Mongoose), Redis and
Socket.IO.

This project is meant to be run **on your own machine**. There is no cloud
storage, no deployment platform config, and no production environment switch
baked in - just a straightforward local dev setup.

## Features

- Email/password and Google-OAuth authentication, JWT access/refresh tokens
- Posts with attachments, reactions, mentions, availability (public/friends/only-me)
- Nested comments/replies with reactions
- Direct messages and group chats over Socket.IO, backed by Redis for
  online-presence/socket tracking
- Optional push notifications (Firebase Cloud Messaging) - safely disabled
  if you don't configure credentials
- A GraphQL endpoint (`/graphql`) alongside the REST routes
- File uploads (avatars, cover photos, post/comment/chat attachments) stored
  on local disk

## Tech stack

Express 5 · TypeScript · MongoDB/Mongoose · Redis · Socket.IO · GraphQL ·
Zod validation · JWT · bcrypt

## Getting started

### 1. Start MongoDB & Redis

```bash
docker compose up -d
```

This only starts a local MongoDB and Redis container - nothing else. If you'd
rather use your own local installs of Mongo/Redis, that's fine too; just
point `DB_URL` / `REDIS_URI` at them.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in at least the JWT secrets and `ENCRYPTION_byte`. Everything else has a
sensible local default. See the comments in `.env.example` for details.

### 3. Install dependencies & run

```bash
npm install
npm run start:dev   # watches and rebuilds/reruns on change
```

The API listens on `http://localhost:3000` by default (`/health` is a good
first check).

### Build & run in "production mode" locally

```bash
npm run build
npm start
```

### Tests

```bash
npm test
```

## Project structure

```
src/
  app.bootstrap.ts        # express app + middleware + routes wiring
  main.ts                 # entrypoint: connects DB/Redis, starts the server
  config/                 # env var loading (see config.service.ts)
  DB/                      # mongoose models + repositories
  middleware/              # auth, validation, error handling
  common/                  # shared services, utils, enums, exceptions, DTOs
  modules/
    auth/                  # signup, login, OAuth, refresh tokens
    user/                   # profile, avatar/cover uploads, dashboard
    post/                   # posts + GraphQL resolvers
    comment/                # comments/replies + reactions
    chat/                   # direct/group chat + Socket.IO events
    notification/           # in-app + push notifications
    realtime/                # Socket.IO server bootstrap
    graphql/                 # merged GraphQL schema
```

## API overview

| Method | Path | Description |
|---|---|---|
| POST | `/auth/signup` | Create an account |
| POST | `/auth/login` | Log in (email/password or Google) |
| POST | `/auth/logout` | Revoke the current/all refresh tokens |
| GET | `/user` | Current user's profile |
| GET | `/user/dashboard` | Post/comment/like/friend counters |
| PATCH | `/user/profile-image` | Get an upload link for a new avatar |
| PATCH | `/user/profile-cover-images` | Upload cover photos |
| DELETE | `/user/profile` | Delete the account and its content |
| POST | `/post` | Create a post |
| PATCH | `/post/:postId` | Update a post |
| PATCH | `/post/:postId/react` | React to a post |
| DELETE | `/post/:postId` | Delete a post |
| POST | `/comment/:postId` | Comment on a post |
| POST | `/comment/:commentId/post/:postId` | Reply to a comment |
| PATCH | `/comment/:commentId/react` | React to a comment |
| DELETE | `/comment/:commentId` | Delete a comment |
| POST | `/chat/group` | Create a group chat |
| GET | `/chat/group/:groupId` | Fetch a group chat |
| GET, POST | `/graphql` | GraphQL endpoint (posts & users) |
| GET | `/uploads/*` | Serve an uploaded file |
| GET | `/health` | Health check |

Auth, validation, and DTOs are attached per-route inside each
`*.controller.ts` file.

## File storage

Uploaded files are written to `./uploads` (configurable via `UPLOADS_DIR`)
and served back through `/uploads/<key>`. This replaces the original
project's AWS S3 integration one-for-one (`src/common/services/storage.service.ts`
exposes the same method names S3 had - `uploadAsset`, `uploadAssets`,
`deleteAsset`, `deleteFolderByPrefix`, etc - so the rest of the codebase
didn't need to change).

## Notes on what's different from a typical "production" setup

This project intentionally leaves out anything that assumes a hosting
platform or cloud account:

- No AWS S3 - see "File storage" above.
- No Vercel/serverless adapter or deployment config - `npm start` runs a
  normal long-lived Node process.
- No environment-specific config files - just one `.env` for local dev.
- Push notifications (Firebase) are optional and off by default; the app
  runs fine without any cloud credentials configured.

If you do want to deploy this somewhere later, the pieces you'd revisit are:
swapping local disk storage for an object store, adding a process
manager/reverse proxy, and wiring real Firebase credentials.
