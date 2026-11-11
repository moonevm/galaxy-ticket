import {defineSubcommand} from "../../types.ts";
import {MessageFlags, PermissionFlagsBits, SlashCommandSubcommandBuilder} from "discord.js";
import {errorMessage} from "../../utils/messages.ts";
import {Snippet} from "../../../models/Snippet.ts";

export default defineSubcommand({
    command: "snippet",
    data: new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Create a new snippet")
        .addStringOption((e) => e
            .setName("title")
            .setDescription("A short name for the snippet")
            .setRequired(true)
            .setMaxLength(100)
        )
        .addStringOption((e) => e
            .setName("content")
            .setDescription("The snippet text")
            .setRequired(true)
            .setMaxLength(2000)
        ),

    async execute(interaction) {
        if (!interaction.guildId)
            return interaction.reply(errorMessage("Run this command in a server"));

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator))
            return interaction.reply(errorMessage("You need the **Administrator** permission to create snippets"));

        const title = interaction.options.getString("title", true);
        const content = interaction.options.getString("content", true);

        const snippet = await Snippet.create({
            guildId: interaction.guildId,
            title,
            content,
        });

        await interaction.reply({
            content: `Snippet **${title}** created with ID \`${snippet.id}\``,
            flags: MessageFlags.Ephemeral,
        });
    },
});
