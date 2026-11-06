import path from "node:path";
import { Collection, type ModalSubmitInteraction } from "discord.js";
import type { Modal } from "../types.ts";
import { getFiles } from "./files.ts";

type ValidatedModal = Extract<Modal, { validate: Function }> & { file: string };

export const modals = new Collection<string, Modal>();
export const validatedModals: ValidatedModal[] = [];

function isModal(value: unknown): value is Modal {
  const v = value as Partial<Modal> | undefined;
  if (typeof v?.execute !== "function") return false;
  return typeof v.id === "string" || typeof v.validate === "function";
}

export async function loadModals(dir = path.join(import.meta.dir, "..", "modals")) {
  for (const file of await getFiles(dir)) {
    const mod = await import(file);
    const modal = mod.default ?? mod;
    const rel = path.relative(dir, file);

    if (!isModal(modal)) {
      console.warn(`[modals] Skipping ${rel}: needs "execute" and either "id" or "validate"`);
      continue;
    }

    if (typeof modal.validate === "function") {
      validatedModals.push({ ...modal, file: rel });
      continue;
    }

    if (modals.has(modal.id)) {
      console.warn(`[modals] Duplicate modal id "${modal.id}" in ${rel}, overwriting`);
    }
    modals.set(modal.id, modal);
  }
  console.log(`[modals] Loaded ${modals.size + validatedModals.length} modal(s)`);
}

export async function findModal(interaction: ModalSubmitInteraction): Promise<Modal | undefined> {
  const exact = modals.get(interaction.customId);
  if (exact) return exact;

  for (const modal of validatedModals) {
    try {
      if (await modal.validate(interaction)) return modal;
    } catch (error) {
      console.error(`[modals] Error in validate of ${modal.file}:`, error);
    }
  }
  return undefined;
}
