import { defineButton } from "../types.ts";
import {errorMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";
import {Op} from "sequelize";
import {Panel} from "../../models/Panel.ts";
import {closeTicketModal, holdTicketModal} from "../utils/modals.ts";

export default defineButton({
    id: "ticket-onhold",

    async execute(interaction) {
        const ticket = await Ticket.findOne({
            where: {
                channelId: interaction.channelId,
                status: {
                    [Op.notIn]: ["closed", "on_hold"]
                }
            },
            include: [Panel]
        });
        if (!ticket) return interaction.reply(errorMessage("This ticket no longer exists"));
        const panel = ticket.panel

        if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

        if (!interaction.guild || !interaction.channel || !interaction.memberPermissions) return

        const guildMember = await interaction.guild.members.fetch(interaction.user.id)

        if (!guildMember.roles.cache.has(panel.supportRoleId))
            return interaction.reply(errorMessage(`You do not have the <@&${panel.supportRoleId}> role!`));

        const isAdmin = interaction.memberPermissions.has("Administrator")

        if (ticket.status === "claimed") {
            if (interaction.user.id !== ticket.claimedBy && !isAdmin)
                return interaction.reply(errorMessage(`Only <@${ticket.claimedBy}> or a server administrator can close this ticket!`));
        }

        await interaction.showModal(holdTicketModal({
            ticketId: ticket.id!
        }))
    },
});
