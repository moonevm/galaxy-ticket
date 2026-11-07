import {LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default function holdTicketModal({
    ticketId,
}: {
    ticketId: string,
}) {
    const modal = new ModalBuilder()
        .setCustomId(`ticket-onhold-${ticketId}`)
        .setTitle("Put Ticket on Hold")

    const concernInput = new TextInputBuilder()
        .setCustomId("reason")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Waiting for reply / Under investigation")
        .setRequired(true);

    const concernLabel = new LabelBuilder()
        .setLabel("Reason for Holding Ticket")
        .setDescription("Why is this ticket on hold? e.g. waiting for a screenshot from the user")
        .setTextInputComponent(concernInput)

    modal.addLabelComponents(concernLabel)

    return modal
}
