import { defineModal } from "../types.ts";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ContainerBuilder} from "discord.js";
import { Panel } from "../../models/Panel.ts";
import {errorMessage, ticketCreatedMessage, ticketWelcomeMessage} from "../utils/messages.ts";
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

        const message = await channel.send({
            content: "🎫 Setting up the ticket message"
        })

        let ticket: Ticket;

        try {
            ticket = await Ticket.create({
                channelId: channel.id,
                creatorId: interaction.user.id,
                guildId: guild.id,
                subject: interaction.fields.getTextInputValue("subject").trim() || "No subject",
                panelId: panel.id,
                messageId: message.id
            })
        } catch (e) {
            console.warn("[buttons] Sequelize error", e)
            await channel.delete("Database Error, removing ticket channel")
            return await interaction.reply(errorMessage("Something went wrong"))
        }

        const containers = ticketWelcomeMessage({
            creatorId: interaction.user.id,
            description: panel.welcomeMessage!,
            title: panel.welcomeTitle!,
            ticketId: ticket.id!,
            imageUrl: panel.welcomeImageUrl,
            panelId: panel.id!,
            subject: ticket.subject,

            claimed: ticket.status === "claimed",
            onHold: ticket.status === "on_hold",
        })

        await message.edit({
            components: [
                containers.mainContainer,
            ],
            flags: ["IsComponentsV2"],
            content: ""
        })

        await channel.send({
            components: [
                containers.reasonContainer
            ],
            flags: ["IsComponentsV2"],
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