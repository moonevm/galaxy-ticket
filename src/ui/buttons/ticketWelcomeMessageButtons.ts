import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle
} from "discord.js";

export default function ticketCreatedMessage({
    claimed,
    onHold,
}: {
   claimed: boolean;
   onHold: boolean;
}) {
    const actionRow = new ActionRowBuilder<ButtonBuilder>();

    const closeButton =
        new ButtonBuilder()
            .setCustomId("ticket-close")
            .setLabel("Close")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🗑️")
            .setDisabled(onHold)

    actionRow.addComponents(closeButton)

    const claimUnclaimButton = claimed ?
        new ButtonBuilder()
            .setCustomId("ticket-unclaim")
            .setLabel("Unclaim")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("↩️")
        :
        new ButtonBuilder()
            .setCustomId("ticket-claim")
            .setLabel("Claim")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🙋")
            .setDisabled(onHold)

    actionRow.addComponents(claimUnclaimButton)

    const onHoldContinueButton = onHold ?
        new ButtonBuilder()
            .setCustomId("ticket-continue")
            .setLabel("Continue")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("▶️")
        :
        new ButtonBuilder()
            .setCustomId("ticket-onhold")
            .setLabel("On Hold")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("⏰")


    actionRow.addComponents(onHoldContinueButton)

    return actionRow;

}