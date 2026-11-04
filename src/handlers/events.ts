import path from "node:path";
import { Events, type Client } from "discord.js";
import { getDirectories, getFiles } from "./files.ts";

type AnyHandler = (...args: unknown[]) => unknown;

const knownEvents = new Set<string>(Object.values(Events));

export async function loadEvents(client: Client, dir = path.join(import.meta.dir, "..", "events")) {
  let total = 0;

  for (const eventDir of await getDirectories(dir)) {
    const eventName = path.basename(eventDir);
    if (!knownEvents.has(eventName)) {
      console.warn(`[events] "${eventName}" is not a known discord.js event (typo?)`);
    }

    const handlers: { name: string; run: AnyHandler }[] = [];
    for (const file of await getFiles(eventDir)) {
      const mod = await import(file);
      const name = path.relative(dir, file);
      if (typeof mod.default !== "function") {
        console.warn(`[events] Skipping ${name}: no default-exported function`);
        continue;
      }
      handlers.push({ name, run: mod.default });
    }
    if (handlers.length === 0) continue;

    client.on(eventName, async (...args: unknown[]) => {
      for (const handler of handlers) {
        try {
          await handler.run(...args, client);
        } catch (error) {
          console.error(`[events] Error in ${handler.name}:`, error);
        }
      }
    });
    total += handlers.length;
  }

  console.log(`[events] Loaded ${total} event handler(s)`);
}
