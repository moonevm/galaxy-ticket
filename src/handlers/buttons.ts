import path from "node:path";
import { Collection, type ButtonInteraction } from "discord.js";
import type { Button } from "../types.ts";
import { getFiles } from "./files.ts";

type ValidatedButton = Extract<Button, { validate: Function }> & { file: string };

export const buttons = new Collection<string, Button>();
export const validatedButtons: ValidatedButton[] = [];

function isButton(value: unknown): value is Button {
  const v = value as Partial<Button> | undefined;
  if (typeof v?.execute !== "function") return false;
  return typeof v.id === "string" || typeof v.validate === "function";
}

export async function loadButtons(dir = path.join(import.meta.dir, "..", "buttons")) {
  for (const file of await getFiles(dir)) {
    const mod = await import(file);
    const button = mod.default ?? mod;
    const rel = path.relative(dir, file);

    if (!isButton(button)) {
      console.warn(`[buttons] Skipping ${rel}: needs "execute" and either "id" or "validate"`);
      continue;
    }

    if (typeof button.validate === "function") {
      validatedButtons.push({ ...button, file: rel });
      continue;
    }

    if (buttons.has(button.id)) {
      console.warn(`[buttons] Duplicate button id "${button.id}" in ${rel}, overwriting`);
    }
    buttons.set(button.id, button);
  }
  console.log(`[buttons] Loaded ${buttons.size + validatedButtons.length} button(s)`);
}

export async function findButton(interaction: ButtonInteraction): Promise<Button | undefined> {
  const exact = buttons.get(interaction.customId);
  if (exact) return exact;

  for (const button of validatedButtons) {
    try {
      if (await button.validate(interaction)) return button;
    } catch (error) {
      console.error(`[buttons] Error in validate of ${button.file}:`, error);
    }
  }
  return undefined;
}
