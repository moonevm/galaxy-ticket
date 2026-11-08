import {ContainerBuilder, EmbedBuilder, MessageFlags} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";

export default function errorMessage(error: string, ephemeral: boolean = true) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text("# ⚠️ An error occurred"),
        text("An unexpected error occurred. Please try again later."),
        text(`> ${error}`)
    )

    footer({
        container
    })

    return {
        components: [
            container
        ],
        flags: ephemeral ? MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral : MessageFlags.IsComponentsV2
    }
}
