import { MessageFlags } from "discord.js";
import { findButton } from "../../handlers/buttons.ts";
import { defineEvent } from "../../types.ts";
import { errorMessage } from "../../utils/messages.ts";

export default defineEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isButton()) return;

  const button = await findButton(interaction);
  if (!button) return;

  try {
    await button.execute(interaction);
  } catch (error) {
    console.error(`[buttons] Error handling button "${interaction.customId}":`, error);
    const reply = { ...errorMessage("Something went wrong handling this button."), flags: MessageFlags.Ephemeral } as const;
    if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {});
    else await interaction.reply(reply).catch(() => {});
  }
});