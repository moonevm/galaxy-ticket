import { findSubcommand } from "../../handlers/subcommands.ts";
import { defineEvent } from "../../types.ts";

export default defineEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isAutocomplete()) return;

  const subcommand = findSubcommand(interaction);
  if (!subcommand?.autocomplete) return;

  try {
    await subcommand.autocomplete(interaction);
  } catch (error) {
    const name = `${interaction.commandName} ${interaction.options.getSubcommand(false) ?? ""}`.trim();
    console.error(`[autocomplete] Error in /${name}:`, error);
    if (!interaction.responded) await interaction.respond([]).catch(() => {});
  }
});
