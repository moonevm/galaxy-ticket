import {ContainerBuilder} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function ticketCreatedMessage({
    userId,
}: {
    userId: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text(`# 🎫 <@${userId}> has unclaimed the ticket`),
        text("Don't worry, someone will certainly look after you again soon.")
    )

    footer({
        container
    })

    return container
}