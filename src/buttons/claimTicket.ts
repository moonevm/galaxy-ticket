import { defineButton } from "../types.ts";
import {errorMessage, ticketClaimMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";
import {Panel} from "../../models/Panel.ts";
import {updateWelcomeMessage} from "../utils/tickets/updateWelcomeMessage.ts";

export default defineButton({
    id: "ticket-claim",

    async execute(interaction) {
        const ticket = await Ticket.findOne({
            where: {
                channelId: interaction.channelId,
                status: "open"
            },
            include: [Panel]
        });
        if (!ticket) return interaction.reply(errorMessage("This ticket no longer exists"));
        const panel = ticket.panel

        if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

        if (!interaction.guild || !interaction.channel || !interaction.channel.isSendable()) return

        const guildMember = await interaction.guild.members.fetch(interaction.user.id)

        if (!guildMember.roles.cache.has(panel.supportRoleId))
            return interaction.reply(errorMessage(`You do not have the <@&${panel.supportRoleId}> role!`));

        await interaction.deferUpdate()

        await interaction.channel.send({
            components: [ticketClaimMessage({ userId: interaction.user.id })],
            flags: ["IsComponentsV2"],
        })

        await ticket.update({
            status: "claimed",
            claimedBy: interaction.user.id,
            claimedAt: new Date()
        })

        await updateWelcomeMessage({
            guild: interaction.guild,
            ticketId: ticket.id!
        })
    },
});
