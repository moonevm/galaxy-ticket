import { defineModal } from "../types.ts";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ContainerBuilder} from "discord.js";
import { Panel } from "../../models/Panel.ts";
import {errorMessage, ticketCreatedMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";
import {text} from "../utils/text.ts";
import {Op} from "sequelize";

const PREFIX = "ticket-create-"

export default defineModal({
    validate: (interaction) => interaction.customId.startsWith(PREFIX),

    execute: async (interaction) => {
        const panelId = interaction.customId.slice(PREFIX.length);

        const panel = await Panel.findByPk(panelId);
        if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

        if (!interaction.guild) return

        const ticketCount = await Ticket.count({
            where: {
                creatorId: interaction.user.id,
                status: {
                    [Op.not]: "closed"
                }
            }
        })

        if (panel.maxOpenTicketsPerUser !== 0 && ticketCount >= panel.maxOpenTicketsPerUser!)
            return interaction.reply(errorMessage(`You can have a maximum of ${panel.maxOpenTicketsPerUser} open tickets at a time`));

        // Ich weiß, es ist nicht atomisch, aber ich weiß nicht, wie man es mit sequelize macht :( und claude's lösungen sind nicht wirklich gut

        const guild = await interaction.guild.fetch()

        const channel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            name: `ticket-${interaction.user.displayName}`,
            parent: panel.channelParentId,
            reason: `Ticket created by ${interaction.user.displayName} (${interaction.user.id})`,

            permissionOverwrites: [
                {
                    id: guild.id, // @everyone
                    deny: [
                        "ViewChannel",
                        "SendMessages",
                    ]
                },
                {
                    id: interaction.client.user.id, // Bot
                    allow: [
                        "ViewChannel",
                        "ManageChannels",
                        "SendMessages",
                        "SendMessagesInThreads",
                        "CreatePrivateThreads",
                        "EmbedLinks",
                        "AttachFiles",
                        "UseExternalEmojis",
                        "MentionEveryone",
                        "ManageMessages",
                        "ManageThreads",
                        "ReadMessageHistory",
                    ]
                },
                {
                    id: panel.supportRoleId, // Supporter
                    allow: [
                        "ViewChannel",
                        "SendMessages",
                        "EmbedLinks",
                        "AttachFiles",
                        "AddReactions",
                        "ReadMessageHistory",
                    ]
                },
                {
                    id: interaction.user.id, // Ticket Author
                    allow: [
                        "ViewChannel",
                        "SendMessages",
                        "EmbedLinks",
                        "AttachFiles",
                        "AddReactions",
                        "ReadMessageHistory",
                    ]
                }
            ]
        })

        let ticket: Ticket;

        try {
            ticket = await Ticket.create({
                channelId: channel.id,
                creatorId: interaction.user.id,
                guildId: guild.id,
                subject: interaction.fields.getTextInputValue("subject") || "No subject",
                panelId: panel.id,
            })
        } catch (e) {
            console.warn("[buttons] Sequelize error", e)
            await channel.delete("Database Error, removing ticket channel")
            return await interaction.reply(errorMessage("Something went wrong"))
        }

        await channel.send({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("close ticket")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId(`ticket-close`)
                    )
            ],
        })

        await interaction.reply({
            components: [ticketCreatedMessage({
                guildId: interaction.guild.id,
                channelId: channel.id
            })],
            flags: ["Ephemeral", "IsComponentsV2"]
        })
    }
})