import {defineCommand} from "../types.ts";
import {ChannelType, SlashCommandBuilder} from "discord.js";
import {errorMessage, addUser} from "../utils/messages.ts";
import {Ticket} from "../../models/Ticket.ts";
import {Panel} from "../../models/Panel.ts";
import {TicketParticipant} from "../../models/TicketParticipant.ts";

export default defineCommand({
    data: new SlashCommandBuilder()
        .setName("add-user")
        .setDescription("Add a user to the ticket")
        .addUserOption((e) => e
            .setName("user")
            .setDescription("User to add")
            .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user")!

        const ticket = await Ticket.findOne({
            where: {
                channelId: interaction.channelId,
            },
            include: [Panel]
        });
        if (!ticket) return interaction.reply(errorMessage("This command can only be used inside a ticket."));
        const panel = ticket.panel

        if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

        if (!interaction.channel || !interaction.channel.isSendable())
            return interaction.reply(errorMessage("I can't send messages in this channel"));

        if (!interaction.guild)
            return interaction.reply(errorMessage("Run this command in a server"));

        const guildMember = await interaction.guild.members.fetch(interaction.user.id)

        if (!guildMember.roles.cache.has(panel.supportRoleId))
            return interaction.reply(errorMessage(`You do not have the <@&${panel.supportRoleId}> role!`));

        // Check if the user is already added

        if (
            ticket.creatorId === user.id ||
            await TicketParticipant.findOne({ where: { userId: user.id, removedAt: null, ticketId: ticket.id! } })
        ) {
            return interaction.reply(errorMessage(`The user is already added to the ticket!`));
        }

        await TicketParticipant.create({
            addedAt: new Date(),
            addedBy: interaction.user.id,
            ticketId: ticket.id!,
            userId: user.id,
        })

        const channel = interaction.channel!
        if (channel.type !== ChannelType.GuildText) return

        await channel.permissionOverwrites.edit(user.id, {
            ViewChannel: true,
            SendMessages: true,
            EmbedLinks: true,
            AttachFiles: true,
            AddReactions: true,
            ReadMessageHistory: true,
        })

        await channel.send({
            flags: ["IsComponentsV2"],
            components: [addUser({
                moderatorId: interaction.user.id,
                userId: user.id
            })],
        })

        await interaction.deferReply({ flags: ["Ephemeral"] })
        await interaction.deleteReply()
    },
});
