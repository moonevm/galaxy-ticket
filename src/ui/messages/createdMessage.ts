import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder, SeparatorSpacingSize} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function createdMessage({
    guildId,
    channelId,
}: {
    guildId: string;
    channelId: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text("# 🎫 The ticket has been created"),
        text("Use this button to go directly to your ticket.")
    )

    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))

    const actionRow = new ActionRowBuilder<ButtonBuilder>()

    actionRow.addComponents(
        new ButtonBuilder()
            .setURL(`https://discord.com/channels/${guildId}/${channelId}`)
            .setStyle(ButtonStyle.Link)
            .setLabel("Go to channel")
    )

    container.addActionRowComponents(actionRow)

    footer({
        container
    })

    return container
}