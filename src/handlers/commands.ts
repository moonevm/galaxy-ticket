import path from "node:path";
import { Collection } from "discord.js";
import type { Command } from "../types.ts";
import { getFiles } from "./files.ts";

export const commands = new Collection<string, Command>();

function isCommand(value: unknown): value is Command {
  const v = value as Command | undefined;
  return (
    typeof v?.data?.name === "string" &&
    typeof v.data.toJSON === "function" &&
    (v.execute === undefined || typeof v.execute === "function")
  );
}

export async function loadCommands(dir = path.join(import.meta.dir, "..", "commands")) {
  for (const file of await getFiles(dir)) {
    const mod = await import(file);
    const command = mod.default ?? mod;
    const rel = path.relative(dir, file);

    if (!isCommand(command)) {
      console.warn(`[commands] Skipping ${rel}: missing "data" or "execute" export`);
      continue;
    }
    if (commands.has(command.data.name)) {
      console.warn(`[commands] Duplicate command name "${command.data.name}" in ${rel}, overwriting`);
    }
    commands.set(command.data.name, command);
  }
  console.log(`[commands] Loaded ${commands.size} command(s)`);
}
