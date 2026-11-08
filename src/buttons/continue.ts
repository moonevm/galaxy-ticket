import { defineButton } from "../types.ts";
import {errorMessage, continueMessage} from "../utils/messages.ts";
import { Ticket } from "../../models/Ticket.ts";
import {Panel} from "../../models/Panel.ts";
import {updateWelcomeMessage} from "../utils/tickets/updateWelcomeMessage.ts";

export default defineButton({
    id: "ticket-continue",

    async execute(interaction) {
        const guild = interaction.guild;

        const ticket = await Ticket.findOne({
            where: {
                channelId: interaction.channelId,
                status: "on_hold",
            },
            include: [Panel]
        });
        if (!ticket) return interaction.reply(errorMessage("This ticket no longer exists"));
        const panel = ticket.panel

        if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

        if (!guild || !interaction.channel || !interaction.memberPermissions || !interaction.channel.isSendable()) return

        const guildMember = await interaction.guild.members.fetch(interaction.user.id)

        if (!guildMember.roles.cache.has(panel.supportRoleId))
            return interaction.reply(errorMessage(`You do not have the <@&${panel.supportRoleId}> role!`));

        const isAdmin = interaction.memberPermissions.has("Administrator")

        if (interaction.user.id !== ticket.onHoldBy && !isAdmin)
            return interaction.reply(errorMessage(`Only <@${ticket.onHoldBy}> or a server administrator can resume this ticket!`));

        await ticket.update({
            status: "claimed",
            onHoldBy: undefined,
            onHoldAt: undefined,
            onHoldReason: undefined,
            claimedAt: ticket.claimedAt ? ticket.claimedAt : new Date(), // if it is already claimed do not update the timestamp
            claimedBy: interaction.user.id
        })

        await interaction.channel.send({
            components: [continueMessage({ userId: interaction.user.id })],
            flags: ["IsComponentsV2"]
        })

        await updateWelcomeMessage({
            ticketId: ticket.id!,
            guild
        })

        await interaction.deferUpdate()
    },
});
