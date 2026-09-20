import { spawn } from "node:child_process";

const rawArgs = process.argv.slice(2);
const args = [];

for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index];
  if (arg === "--host") {
    args.push("--hostname", rawArgs[index + 1] ?? "0.0.0.0");
    index += 1;
  } else if (arg === "--strictPort") {
    // Vite-only flag supplied by the shared preview runner.
  } else {
    args.push(arg);
  }
}

const child = spawn("next", ["dev", ...args], { stdio: "inherit", shell: process.platform === "win32" });
child.on("exit", (code) => process.exit(code ?? 0));
