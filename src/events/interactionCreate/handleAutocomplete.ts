import { commands } from "../../handlers/commands.ts";
import { findSubcommand } from "../../handlers/subcommands.ts";
import { defineEvent } from "../../types.ts";

export default defineEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isAutocomplete()) return;

  const autocomplete =
    findSubcommand(interaction)?.autocomplete ??
    commands.get(interaction.commandName)?.autocomplete;
  if (!autocomplete) return;

  try {
    await autocomplete(interaction);
  } catch (error) {
    const name = `${interaction.commandName} ${interaction.options.getSubcommand(false) ?? ""}`.trim();
    console.error(`[autocomplete] Error in /${name}:`, error);
    if (!interaction.responded) await interaction.respond([]).catch(() => {});
  }
});
