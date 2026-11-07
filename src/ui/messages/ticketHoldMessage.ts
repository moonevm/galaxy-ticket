import {ContainerBuilder} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function ticketHoldMessage({
    userId,
    reason,
}: {
    userId: string;
    reason: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text(`# 🎫 <@${userId}> put the ticket on hold`),
        text("Your ticket is paused for now. We'll continue as soon as possible. No need to open a new one."),
        text(`Reason: \`${reason}\``)
    )

    footer({
        container
    })

    return container
}