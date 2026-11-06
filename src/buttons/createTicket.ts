import { defineButton } from "../types.ts";
import { errorMessage } from "../utils/messages.ts";
import { Panel } from "../../models/Panel.ts";
import { ButtonStyle, ChannelType, TextInputStyle } from "discord.js";
import { Ticket } from "../../models/Ticket.ts";
import {Op} from "sequelize";
import {createTicketModal} from "../utils/modals.ts";

const PREFIX = "ticket-create-";

export default defineButton({
  validate: (interaction) => interaction.customId.startsWith(PREFIX),

  async execute(interaction) {
    const panelId = interaction.customId.slice(PREFIX.length);

    const panel = await Panel.findByPk(panelId);
    if (!panel) return interaction.reply(errorMessage("This panel no longer exists"));

    if (!interaction.guild) return

    const ticketCount = await Ticket.count({
      where: {
        creatorId: interaction.user.id,
        guildId: interaction.guild.id,
        status: {
          [Op.not]: "closed"
        }
      }
    })

    if (panel.maxOpenTicketsPerUser !== 0 && ticketCount >= panel.maxOpenTicketsPerUser!)
      return interaction.reply(errorMessage(`You can have a maximum of ${panel.maxOpenTicketsPerUser} open tickets at a time`));

    await interaction.showModal(
        createTicketModal({
          panelId: panel.id!,
          title: panel.title
        })
    )
  },
});
