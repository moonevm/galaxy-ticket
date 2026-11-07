import {Ticket} from "../../../models/Ticket.ts";
import {ChannelType, type Guild, type Interaction} from "discord.js";
import {ticketWelcomeMessage} from "../messages.ts";
import {Panel} from "../../../models/Panel.ts";

export async function updateWelcomeMessage({
    ticketId,
    guild,
}: {
    ticketId: string;
    guild: Guild
}) {
    const ticket = await Ticket.findByPk(ticketId, { include: [Panel] });
    if (!ticket) throw new Error("No ticket found")

    const panel = ticket.panel
    if (!panel) throw new Error("No panel found")

    const channel = await guild.channels.fetch(ticket.channelId)
    if (!channel) throw new Error("No channel found")
    if (channel.type !== ChannelType.GuildText) throw new Error("Not a text based channel")

    const message = await channel.messages.fetch(ticket.messageId)
    if (!message) throw new Error("No message found")

    await message.edit({
        components: [
            ticketWelcomeMessage({
                onHoldReason: ticket.onHoldReason,
                onHold: ticket.status === "on_hold",
                claimedBy: ticket.claimedBy,
                claimed: ticket.status === "claimed",

                imageUrl: panel.welcomeImageUrl,

                subject: ticket.subject,
                title: panel.welcomeTitle,
                description: panel.welcomeMessage,

                panelId: panel.id!,
                ticketId: ticket.id!,
                creatorId: ticket.creatorId
            }).mainContainer
        ]
    })
}