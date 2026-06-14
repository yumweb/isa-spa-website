import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// `base` (and VITE_API_URL) come from env so the SPA can be built to serve
// under a subpath in production (e.g. VITE_BASE=/cms/) while staying at root
// for local dev. Set in apps/admin/.env.production for the deploy.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE || "/",
    plugins: [react()],
    server: { port: 5173 },
  };
});
