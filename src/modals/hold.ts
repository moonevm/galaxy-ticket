import { defineModal } from "../types.ts";
import {ButtonStyle, ChannelType} from "discord.js";
import { Panel } from "../../models/Panel.ts";
import {errorMessage, ticketClosedMessage, holdMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";
import {updateWelcomeMessage} from "../utils/tickets/updateWelcomeMessage.ts";

const PREFIX = "ticket-onhold-"

export default defineModal({
    validate: (interaction) => interaction.customId.startsWith(PREFIX),

    execute: async (interaction) => {
        const ticketId = interaction.customId.slice(PREFIX.length);
        const guild = interaction.guild;

        if (!guild || !interaction.channel) return

        const ticket = await Ticket.findByPk(ticketId, { include: [Panel] });
        if (!ticket) throw new Error("No ticket found")

        const panel = ticket.panel
        if (!panel) throw new Error("No panel found")

        const channel = await guild.channels.fetch(ticket.channelId)
        if (!channel) throw new Error("No channel found")
        if (channel.type !== ChannelType.GuildText) throw new Error("Not a text based channel")

        const reason = interaction.fields.getTextInputValue("reason").trim()

        await ticket.update({
            status: "on_hold",
            onHoldBy: interaction.user.id,
            onHoldAt: new Date(),
            onHoldReason: reason
        })

        await channel.send({
            flags: ["IsComponentsV2"],
            components: [holdMessage({ userId: interaction.user.id, reason })]
        })

        await updateWelcomeMessage({
            ticketId: ticket.id!,
            guild
        })

        await interaction.deferUpdate()
    }
})