import {
    ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder,
    SlashCommandBuilder, TextDisplayBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder,
    ButtonStyle
} from "discord.js";
import { defineCommand } from "../types.ts";
import { errorMessage } from "../utils/messages.ts";
import images from "../utils/images.ts";
import {Panel} from "../../models/Panel.ts"
import {Op} from "sequelize";

function ticketMessageComponent({
    panelId,
    title,
    description,
    buttonLabel,
    imageUrl
}: {
    panelId: string;
    title: string;
    buttonLabel: string;
    description?: string | null;
    imageUrl?: string | null;
}) {
    const container = new ContainerBuilder();

    function text(text: string) { return new TextDisplayBuilder().setContent(text) }

    container.addTextDisplayComponents(
        text(`# 🎫 ${title}`),
    );

    description && container.addTextDisplayComponents(
        text(description)
    )

    container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder()
                .setURL(imageUrl ? imageUrl: images.TICKET_DEFAULT_BANNER)
        )
    );

    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large));

    container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder()
                .setURL(images.EMBED_FOOTER_PRIDE)
        )
    );

    container.addTextDisplayComponents(
        text(`-# Panel ID: \`${panelId}\``),
    );

    // Action Row

    const actionRow = new ActionRowBuilder<ButtonBuilder>();

    actionRow.addComponents(
        new ButtonBuilder()
            .setCustomId(`ticket-create-${panelId}`)
            .setLabel(buttonLabel)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🎫")
    );

    return [container, actionRow];
}

export default defineCommand({
  data: new SlashCommandBuilder()
      .setName("message")
      .setDescription("Send Panel Message")
      .addStringOption((e) => e
          .setName("panel")
          .setDescription("Start typing a panel name")
          .setRequired(true)
          .setAutocomplete(true)
      ),

  async autocomplete(interaction) {
      if (!interaction.guildId) return interaction.respond([]);

      const search = interaction.options.getFocused().trim();

      const panels = await Panel.findAll({
          where: {
              guildId: interaction.guildId,
              ...(search && { title: { [Op.iLike]: `%${search}%` } }),
          },
          order: [["name", "ASC"]],
          limit: 25,
      });

      await interaction.respond(panels.map((panel) => ({
          name: panel.title.slice(0, 100),
          value: panel.id!,
      })));
  },

  async execute(interaction) {
    const panelId = interaction.options.getString("panel");
    if (!panelId) return;

    if (!interaction.channel || !interaction.channel.isSendable())
      return interaction.reply(errorMessage("I can't send messages in this channel"));

    if (!interaction.guild)
        return interaction.reply(errorMessage("Run this command in a server"));

    await interaction.reply({ content: "Sending Panel Message...", flags: ["Ephemeral"] });
    const panel = await Panel.findOne({
        where: {
            id: panelId,
            guildId: interaction.guild.id
        }
    });
    if (!panel)
        return interaction.editReply(errorMessage("No Panel found with this ID", false));

    await interaction.channel.send({
        components: ticketMessageComponent({
            panelId: panel.id!,
            buttonLabel: panel.buttonLabel!,
            description: panel.description,
            title: panel.title,
            imageUrl: panel.imageUrl,
        }),
        flags: ["IsComponentsV2"]
    });

    await interaction.editReply("✅ Panel message sent!")
  },
});
