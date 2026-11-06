import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder} from "discord.js";
import {text} from "../text.ts";

export default function ticketCreatedMessage({
    guildId,
    channelId,
}: {
    guildId: string;
    channelId: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text("# ✅ The ticket has been created"),
        text("Use this button to go directly to your ticket.")
    )

    const actionRow = new ActionRowBuilder<ButtonBuilder>()

    actionRow.addComponents(
        new ButtonBuilder()
            .setURL(`https://discord.com/channels/${guildId}/${channelId}`)
            .setStyle(ButtonStyle.Link)
            .setLabel("Go to channel")
    )

    container.addActionRowComponents(actionRow)

    return container
}