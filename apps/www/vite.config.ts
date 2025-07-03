import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths()
  ],
  optimizeDeps: {
    include: Object.keys(pkg.dependencies).filter((dep) => !dep.startsWith("@inklate/"))
  },
  server: {
    watch: {
      awaitWriteFinish: true
    },
    warmup: {
      clientFiles: ["./app/**/*", "./components/**/*"],
      ssrFiles: ["./app/**/*", "./components/**/*"]
    }
  }
});
