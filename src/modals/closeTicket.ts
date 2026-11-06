import { defineModal } from "../types.ts";
import {ButtonStyle, ChannelType} from "discord.js";
import { Panel } from "../../models/Panel.ts";
import {errorMessage, ticketClosedMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";

const PREFIX = "ticket-close-"

export default defineModal({
    validate: (interaction) => interaction.customId.startsWith(PREFIX),

    execute: async (interaction) => {
        const ticketId = interaction.customId.slice(PREFIX.length);

        if (!interaction.guild || !interaction.channel) return

        const ticket = await Ticket.findByPk(ticketId, {
            include: [Panel]
        });
        if (!ticket || !ticket.panel) return interaction.reply(errorMessage("This ticket or panel no longer exists"));

        const panel = ticket.panel

        const user = await interaction.client.users.fetch(ticket.creatorId)
        const guild = await interaction.guild.fetch()

        const closedAt = new Date()

        const reason = interaction.fields.getTextInputValue("reason")

        try {
            await user.send({
                flags: ["IsComponentsV2"],
                components: [ticketClosedMessage({ ticketId: ticket.id!, closedAt, closedBy: interaction.user.id, createdAt: ticket.createdAt, guild, panelId: panel.id!, reason })]
            })
        } catch (e) {
            console.error(`[commands] Couldn't send DM to ${interaction.user.username} (${interaction.user.id}) at src/buttons/closeTicket.ts`, e)
        }

        await ticket.update({
            status: "closed",
            closedBy: interaction.user.id,
            closedAt: new Date(),
            closeReason: reason
        })

        await interaction.channel.delete(`Ticket got closed by ${interaction.user.username} (${interaction.user.id}). Reason: ${reason}`)
    }
})