import {LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default function createTicketModal({
    ticketId,
}: {
    ticketId: string,
}) {
    const modal = new ModalBuilder()
        .setCustomId(`ticket-close-${ticketId}`)
        .setTitle("Close Ticket")

    const concernInput = new TextInputBuilder()
        .setCustomId("reason")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Issue clarified / Problem solved / No response")
        .setRequired(false);

    const concernLabel = new LabelBuilder()
        .setLabel("Reason for Closure")
        .setDescription("Your reason will be logged and sent to the ticket creator.")
        .setTextInputComponent(concernInput)

    modal.addLabelComponents(concernLabel)

    return modal
}
