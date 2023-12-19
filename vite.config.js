import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { name, peerDependencies, dependencies } from "./package.json";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  base: "/",
  plugins: [react(), dtsPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "CrontabReact",
      formats: ["es", "umd"],
      fileName: (format) => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies),
        ...Object.keys(dependencies),
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-select": "Select",
        },
      },
    },
  },
  optimizeDeps: {
    include: ["src/types/Crontab.d.ts"],
  },
});
