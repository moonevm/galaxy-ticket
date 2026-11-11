import path from "node:path";
import {
  Collection,
  SlashCommandBuilder,
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { Subcommand } from "../types.ts";
import { commands } from "./commands.ts";
import { getFiles } from "./files.ts";

export const subcommands = new Collection<string, Subcommand>();

const key = (command: string, subcommand: string) => `${command} ${subcommand}`;

function isSubcommand(value: unknown): value is Subcommand {
  const v = value as Partial<Subcommand> | undefined;
  return (
    typeof v?.command === "string" &&
    typeof v.data?.name === "string" &&
    typeof v.data.toJSON === "function" &&
    typeof v.execute === "function"
  );
}

export async function loadSubcommands(dir = path.join(import.meta.dir, "..", "subcommands")) {
  for (const file of await getFiles(dir)) {
    const mod = await import(file);
    const subcommand = mod.default ?? mod;
    const rel = path.relative(dir, file);

    if (!isSubcommand(subcommand)) {
      console.warn(`[subcommands] Skipping ${rel}: missing "command", "data" or "execute" export`);
      continue;
    }

    const id = key(subcommand.command, subcommand.data.name);
    if (subcommands.has(id)) {
      console.warn(`[subcommands] Duplicate subcommand "/${id}" in ${rel}, overwriting`);
    }
    subcommands.set(id, subcommand);
  }
  console.log(`[subcommands] Loaded ${subcommands.size} subcommand(s)`);

  createMissingParents();
}

function createMissingParents() {
  for (const sub of subcommands.values()) {
    if (commands.has(sub.command)) continue;

    const description =
      getSubcommandsFor(sub.command).find((s) => s.parentDescription)?.parentDescription ??
      `${sub.command} commands`;

    commands.set(sub.command, {
      data: new SlashCommandBuilder().setName(sub.command).setDescription(description),
    });
  }
}

export function getSubcommandsFor(command: string): Subcommand[] {
  return [...subcommands.filter((sub) => sub.command === command).values()];
}

export function findSubcommand(
  interaction: ChatInputCommandInteraction | AutocompleteInteraction,
): Subcommand | undefined {
  const name = interaction.options.getSubcommand(false);
  if (!name) return undefined;
  return subcommands.get(key(interaction.commandName, name));
}
