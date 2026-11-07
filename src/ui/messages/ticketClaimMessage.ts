import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder, SeparatorSpacingSize} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function ticketCreatedMessage({
    userId,
}: {
    userId: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text(`# 🎫 <@${userId}> claimed the ticket`),
        text("Your matters will now be taken care of. However, be patient if you do not always receive an answer immediately.")
    )

    footer({
        container
    })

    return container
}