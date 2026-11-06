import { defineButton } from "../types.ts";
import {errorMessage, ticketClosedMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";
import {Op} from "sequelize";
import {Panel} from "../../models/Panel.ts";
import {closeTicketModal} from "../utils/modals.ts";

export default defineButton({
    id: "ticket-close",

    async execute(interaction) {
        const ticket = await Ticket.findOne({
            where: {
                channelId: interaction.channelId,
                status: {
                    [Op.not]: "closed"
                }
            },
            include: [Panel]
        });
        if (!ticket) return interaction.reply(errorMessage("This ticket no longer exists"));
        const panel = ticket.panel

        if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

        if (!interaction.guild || !interaction.channel) return

        const guildMember = await interaction.guild.members.fetch(interaction.user.id)

        if (!guildMember.roles.cache.has(panel.supportRoleId))
            return interaction.reply(errorMessage(`You do not have the <@&${panel.supportRoleId}> role!`));

        await interaction.showModal(
            closeTicketModal({
                ticketId: ticket.id!
            })
        )
    },
});
