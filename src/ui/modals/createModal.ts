import {LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default function createModal({
    panelId,
    title,
}: {
    panelId: string,
    title: string
}) {
    const modal = new ModalBuilder()
        .setCustomId(`ticket-create-${panelId}`)
        .setTitle(title)

    const concernInput = new TextInputBuilder()
        .setCustomId("subject")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("I need help with ...")
        .setRequired(true);

    const concernLabel = new LabelBuilder()
        .setLabel("What is your concern?")
        .setDescription("Please describe your issue in as much detail as possible so our staff can assist you.")
        .setTextInputComponent(concernInput)

    modal.addLabelComponents(concernLabel)

    return modal
}
