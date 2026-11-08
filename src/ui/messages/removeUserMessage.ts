import {ContainerBuilder} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function ticketAddUser({
    moderatorId,
    userId,
}: {
    moderatorId: string;
    userId: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text(`# 🎫 <@${userId}> was removed from the ticket`),
        text(`<@${moderatorId}> removed <@${userId}> from this ticket. They no longer have access to this channel.`)
    )

    footer({
        container
    })

    return container
}