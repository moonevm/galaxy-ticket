import {ContainerBuilder} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function continueMessage({
    userId,
}: {
    userId: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text(`# 🎫 <@${userId}> resumed the ticket`),
        text("Thanks for waiting! Your ticket is active again and will be taken care of.")
    )

    footer({
        container
    })

    return container
}