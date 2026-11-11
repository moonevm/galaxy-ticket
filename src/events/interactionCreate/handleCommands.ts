import { MessageFlags } from "discord.js";
import { commands } from "../../handlers/commands.ts";
import { findSubcommand } from "../../handlers/subcommands.ts";
import { defineEvent } from "../../types.ts";
import { errorMessage } from "../../utils/messages.ts";

export default defineEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  const subcommand = findSubcommand(interaction);
  const execute = subcommand?.execute ?? command.execute;
  if (!execute) return;

  try {
    await execute(interaction);
  } catch (error) {
    console.error(`[commands] Error in /${interaction.commandName}:`, error);
    const reply = { ...errorMessage("Something went wrong running this command."), flags: MessageFlags.Ephemeral } as const;
    if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {});
    else await interaction.reply(reply).catch(() => {});
  }
});
