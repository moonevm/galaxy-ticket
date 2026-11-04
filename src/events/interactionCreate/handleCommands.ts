import { MessageFlags } from "discord.js";
import { commands } from "../../handlers/commands.ts";
import { defineEvent } from "../../types.ts";

export default defineEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[commands] Error in /${interaction.commandName}:`, error);
    const reply = { content: "Something went wrong running this command.", flags: MessageFlags.Ephemeral } as const;
    if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {});
    else await interaction.reply(reply).catch(() => {});
  }
});
