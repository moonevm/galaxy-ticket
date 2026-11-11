import {defineSubcommand} from "../../types.ts";
import {PermissionFlagsBits, SlashCommandSubcommandBuilder} from "discord.js";
import {Op} from "sequelize";
import {errorMessage} from "../../utils/messages.ts";
import {Snippet} from "../../../models/Snippet.ts";

export default defineSubcommand({
    command: "snippet",
    parentDescription: "Manage your ticket snippets",
    data: new SlashCommandSubcommandBuilder()
        .setName("delete")
        .setDescription("Delete a snippet")
        .addStringOption((e) => e
            .setName("snippet")
            .setDescription("Start typing a snippet title")
            .setRequired(true)
            .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        if (!interaction.guildId) return interaction.respond([]);

        const search = interaction.options.getFocused().trim();

        const snippets = await Snippet.findAll({
            where: {
                guildId: interaction.guildId,
                ...(search && { title: { [Op.iLike]: `%${search}%` } }),
            },
            order: [["title", "ASC"]],
            limit: 25,
        });

        await interaction.respond(snippets.map((snippet) => ({
            name: snippet.title.slice(0, 100),
            value: snippet.id!,
        })));
    },

    async execute(interaction) {
        if (!interaction.guildId)
            return interaction.reply(errorMessage("Run this command in a server"));

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator))
            return interaction.reply(errorMessage("You need the **Administrator** permission to create snippets"));

        const id = interaction.options.getString("snippet", true);

        const snippet = await Snippet.findOne({
            where: {
                id,
                guildId: interaction.guildId,
            },
        });

        if (!snippet)
            return interaction.reply(errorMessage("Snippet not found"));

        await Snippet.destroy({
            where: {
                id,
                guildId: interaction.guildId,
            }
        })

        await interaction.reply({
            content: `❌ Successfully deleted snippet \`${snippet.title}\``,
            flags: "Ephemeral"
        });
    },
});
