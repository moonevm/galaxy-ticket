import { MessageFlags } from "discord.js";
import { findModal } from "../../handlers/modals.ts";
import { defineEvent } from "../../types.ts";
import { errorMessage } from "../../utils/messages.ts";

export default defineEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  const modal = await findModal(interaction);
  if (!modal) return;

  try {
    await modal.execute(interaction);
  } catch (error) {
    console.error(`[modals] Error handling modal "${interaction.customId}":`, error);
    const reply = { ...errorMessage("Something went wrong handling this modal."), flags: MessageFlags.Ephemeral } as const;
    if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {});
    else await interaction.reply(reply).catch(() => {});
  }
});
