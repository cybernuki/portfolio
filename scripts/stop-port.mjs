// Stops whatever listens on a given port (Windows-safe, no broad process-name patterns).
import { execSync } from "node:child_process";
const port = process.argv[2];
if (!port) process.exit(1);
const out = execSync("netstat -ano -p tcp", { encoding: "utf8" });
const pids = new Set();
for (const line of out.split(/\r?\n/)) {
  if (line.includes(`:${port} `) && line.includes("LISTENING")) pids.add(line.trim().split(/\s+/).pop());
}
for (const pid of pids) {
  try { execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" }); console.log("stopped", pid); } catch {}
}
