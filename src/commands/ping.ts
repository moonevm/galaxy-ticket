import { SlashCommandBuilder } from "discord.js";
import { defineCommand } from "../types.ts";

export default defineCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply(`Pong! (${interaction.client.ws.ping}ms)`);
  },
});
