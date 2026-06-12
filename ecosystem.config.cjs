/**
 * PM2 process definitions for local/dev. Each app runs its own dev server.
 * Start:  pnpm exec pm2 start ecosystem.config.cjs   (or: pm2 start ecosystem.config.cjs)
 * Logs:   pm2 logs   |   Status: pm2 status   |   Stop: pm2 delete ecosystem.config.cjs
 *
 * Requires the Docker MySQL (docker compose up -d) to be up before `isa-api`.
 */
const PNPM = "/Users/sameerjoshi/.nvm/versions/node/v22.22.3/bin/pnpm";

module.exports = {
  apps: [
    {
      name: "isa-api",
      cwd: "./apps/api",
      script: PNPM,
      args: "dev",
      interpreter: "none",
      env: { NODE_ENV: "development" },
    },
    {
      name: "isa-web",
      cwd: "./apps/web",
      script: PNPM,
      args: "dev",
      interpreter: "none",
      env: { NODE_ENV: "development" },
    },
    {
      name: "isa-admin",
      cwd: "./apps/admin",
      script: PNPM,
      args: "dev",
      interpreter: "none",
      env: { NODE_ENV: "development" },
    },
  ],
};
