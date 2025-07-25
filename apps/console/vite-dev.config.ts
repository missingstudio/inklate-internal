import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import deno from "@deno/vite-plugin";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  plugins: [deno(), tailwindcss(), reactRouter(), tsconfigPaths()],
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
  },
  environments: {
    ssr: {
      build: {
        target: "ESNext"
      },
      resolve: {
        conditions: ["deno"],
        externalConditions: ["deno"]
      }
    }
  }
});
