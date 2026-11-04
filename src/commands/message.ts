import {
    ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder,
    SlashCommandBuilder, TextDisplayBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder,
    ButtonStyle
} from "discord.js";
import { defineCommand } from "../types.ts";
import { errorMessage } from "../utils/messages.ts";
import images from "../utils/images.ts";

function ticketMessageComponent() {
    const container = new ContainerBuilder();

    function text(text: string) { return new TextDisplayBuilder().setContent(text) }

    container.addTextDisplayComponents(
        text("# 🎫 Ticket System"),
        text("message content")
    );

    container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder()
                .setURL(images.TICKET_DEFAULT_BANNER)
        )
    );

    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large));

    container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder()
                .setURL(images.EMBED_FOOTER_PRIDE)
        )
    );

    // Action Row

    const actionRow = new ActionRowBuilder<ButtonBuilder>();

    actionRow.addComponents(
        new ButtonBuilder()
            .setCustomId("ticket-create")
            .setLabel("Create Ticket")
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

    await interaction.reply({ content: "sending...", flags: ["Ephemeral"] })

    await interaction.channel.send({
        components: ticketMessageComponent(),
        flags: ["IsComponentsV2"]
    });

    await interaction.editReply("sent")
  },
});
