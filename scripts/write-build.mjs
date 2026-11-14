import { writeFile } from "node:fs/promises";
const sha = process.env.VITE_BUILD_SHA || process.env.GITHUB_SHA || "local";
if (sha !== "local" && !/^[a-f0-9]{40}$/.test(sha))
  throw new Error("Invalid build commit.");
await writeFile(
  new URL("../dist/_build.json", import.meta.url),
  JSON.stringify({ commit: sha, builtAt: new Date().toISOString() }),
);
