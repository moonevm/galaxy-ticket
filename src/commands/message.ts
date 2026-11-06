import {
    ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder,
    SlashCommandBuilder, TextDisplayBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder,
    ButtonStyle
} from "discord.js";
import { defineCommand } from "../types.ts";
import { errorMessage } from "../utils/messages.ts";
import images from "../utils/images.ts";
import {Panel} from "../../models/Panel.ts";

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
    description?: string;
    imageUrl?: string;
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
  data: new SlashCommandBuilder().setName("message").setDescription("sends ticket message"),
  async execute(interaction) {
    if (!interaction.channel || !interaction.channel.isSendable())
      return interaction.reply(errorMessage("I can't send messages in this channel"));

    if (!interaction.guild)
        return interaction.reply(errorMessage("Run this command in a server"));

    await interaction.reply({ content: "sending...", flags: ["Ephemeral"] });

    const panel = (await Panel.create({
        name: "Panel Name",
        buttonLabel: "Öffne ein Ticket",
        guildId: interaction.guild.id,
        title: "Ticket Titel",
        description: "Ticket Beschreibung",
        supportRoleId: "1567881410390401024"
    })).toJSON();

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

    await interaction.editReply("sent")
  },
});
