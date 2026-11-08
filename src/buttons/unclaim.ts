import { defineButton } from "../types.ts";
import {errorMessage, ticketUnclaimMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";
import {Panel} from "../../models/Panel.ts";
import {updateWelcomeMessage} from "../utils/tickets/updateWelcomeMessage.ts";

export default defineButton({
    id: "ticket-unclaim",

    async execute(interaction) {
        const ticket = await Ticket.findOne({
            where: {
                channelId: interaction.channelId,
                status: "claimed"
            },
            include: [Panel]
        });
        if (!ticket) return interaction.reply(errorMessage("This ticket no longer exists"));
        const panel = ticket.panel

        if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

        if (!interaction.guild || !interaction.channel || !interaction.channel.isSendable() || !interaction.memberPermissions) return

        const guildMember = await interaction.guild.members.fetch(interaction.user.id)

        if (!guildMember.roles.cache.has(panel.supportRoleId))
            return interaction.reply(errorMessage(`You do not have the <@&${panel.supportRoleId}> role!`));

        const isAdmin = interaction.memberPermissions.has("Administrator")

        if (interaction.user.id !== ticket.claimedBy && !isAdmin) return interaction.reply(errorMessage(`Only <@${ticket.claimedBy}> or a server administrator can unclaim this ticket!`));

        await interaction.deferUpdate()

        await interaction.channel.send({
            components: [ticketUnclaimMessage({ userId: interaction.user.id })],
            flags: ["IsComponentsV2"],
        })

        await ticket.update({
            status: "open",
            claimedBy: interaction.user.id,
            claimedAt: new Date()
        })

        await updateWelcomeMessage({
            guild: interaction.guild,
            ticketId: ticket.id!
        })
    },
});
