import {defineCommand} from "../types.ts";
import {ChannelType, SlashCommandBuilder} from "discord.js";
import {errorMessage, ticketRemoveUser} from "../utils/messages.ts";
import {Ticket} from "../../models/Ticket.ts";
import {Panel} from "../../models/Panel.ts";
import {TicketParticipant} from "../../models/TicketParticipant.ts";

export default defineCommand({
    data: new SlashCommandBuilder()
        .setName("remove-user")
        .setDescription("Remove a user from the ticket")
        .addUserOption((e) => e
            .setName("user")
            .setDescription("User to remove")
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

        // Check if the user isn't added

        const participant = await TicketParticipant.findOne({ where: { userId: user.id, removedAt: null, ticketId: ticket.id! } })

        if (
            !participant
        ) {
            return interaction.reply(errorMessage(`${user.username} isn't part of this ticket`));
        }

        if (ticket.creatorId === user.id) {
            return interaction.reply(errorMessage(`The ticket creator can't be removed from the ticket`));
        }

        const channel = interaction.channel!
        if (channel.type !== ChannelType.GuildText) return

        await channel.permissionOverwrites.delete(user.id)

        await participant.update({
            removedAt: new Date(),
        })

        await channel.send({
            flags: ["IsComponentsV2"],
            components: [ticketRemoveUser({
                moderatorId: interaction.user.id,
                userId: user.id
            })],
        })

        await interaction.deferReply({ flags: ["Ephemeral"] })
        await interaction.deleteReply()
    },
});
