import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const pagesRoot = resolve(projectRoot, "github-pages");

export default defineConfig({
  base: "./",
  root: pagesRoot,
  publicDir: resolve(projectRoot, "public"),
  plugins: [react()],
  build: {
    outDir: resolve(projectRoot, "github-pages-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(pagesRoot, "index.html"),
        myceliumVillage: resolve(pagesRoot, "work/mycelium-village/index.html"),
        rami: resolve(pagesRoot, "work/rami/index.html"),
        pawJourney: resolve(pagesRoot, "work/paw-journey/index.html"),
        flightToVarennes: resolve(pagesRoot, "work/flight-to-varennes/index.html"),
      },
    },
  },
});
