#!/bin/sh

npx @better-auth/cli generate -y --config ./modules/0000-auth/lib/auth.server.js
npx @better-auth/cli migrate -y --config ./modules/0000-auth/lib/auth.server.js

pnpm run db:migrate
