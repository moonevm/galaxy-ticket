import { watch } from "node:fs";
import path from "node:path";
import { StandaloneInstance } from "galactic.ts";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN is not set (add it to .env)");

const dev = process.argv.includes("--dev");

class Instance extends StandaloneInstance {
    restartClusters() {
        for (const cluster of this.clusters.values()) cluster.child.kill("SIGTERM");
    }
}

const instance = new Instance(
    path.join(import.meta.dir, "bot.ts"),
    1,
    1,
    token,
    ["Guilds", "MessageContent", "GuildMessages", "GuildPresences", "GuildMembers"],
);

instance.start();

let shuttingDown = false;
const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    await instance.shutdown();
    process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

if (dev) {
    const srcDir = import.meta.dir;
    let timer: Timer | undefined;

    watch(srcDir, { recursive: true }, (_event, file) => {
        if (!file || !/\.(ts|js)$/.test(file)) return;
        if (path.resolve(srcDir, file) === import.meta.path) {
            console.log("[dev] src/index.ts changed, restart the manager manually to apply it");
            return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log(`[dev] ${file} changed, restarting clusters...`);
            instance.restartClusters();
        }, 200);
    });
    console.log("[dev] Watching src/ for changes");
}
