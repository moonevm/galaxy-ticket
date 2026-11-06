import {ContainerBuilder, EmbedBuilder} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function errorMessage(error: string, multiline: boolean = false) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text("# ⚠️ An error occurred"),
        text("An unexpected error occurred. Please try again later."),
        multiline ?
            text(error) :
            text(`> ${error}`)
    )

    footer({
        container
    })

    return {
        components: [
            container
        ],
        flags: ["IsComponentsV2", "Ephemeral"] as const
    }
}
