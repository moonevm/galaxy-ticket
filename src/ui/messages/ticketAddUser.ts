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
        text(`# 🎫 <@${userId}> was added to the ticket`),
        text(`<@${moderatorId}> added <@${userId}> to this ticket. They can now view this channel and take part in the conversation.`)
    )

    footer({
        container
    })

    return container
}