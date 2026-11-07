import {
    ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize
} from "discord.js";
import {text} from "../../utils/text.ts";
import {footer} from "../../utils/components/footer.ts";
import {ticketWelcomeMessageButton} from "../../utils/buttons.ts";
import images from "../../utils/images.ts";

export default function ticketCreatedMessage({
    panelId,
    ticketId,
    creatorId,
    subject,
    title,
    description,
    imageUrl,

    claimed,
    onHold,
}: {
    panelId: string;
    ticketId: string;
    creatorId: string;
    subject: string;
    title: string;
    description: string;
    imageUrl?: string;

    claimed: boolean;
    onHold: boolean;
}) {
    const container = new ContainerBuilder()

    const fields = [
        {
            name: "Panel ID",
            value: `\`${panelId}\``,
            emoji: "📋"
        },
        {
            name: "Case ID",
            value: `\`${ticketId}\``,
            emoji: "🎫"
        },
        {
            name: "Creator",
            value: `<@${creatorId}>`,
            emoji: "✍️"
        },
    ]

    container.addTextDisplayComponents(
        text(`# 🎫 ${title}`),
        text(description)
    )

    container.addTextDisplayComponents(
        text(`${fields.map((e) => `- ${e.emoji} **${e.name}:** ${e.value}`).join("\n")}`)
    )

    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))

    const mediaGallery = new MediaGalleryBuilder()

    mediaGallery.addItems(
        new MediaGalleryItemBuilder()
            .setURL(imageUrl ? imageUrl : images.TICKET_WELCOME_DEFAULT_BANNER)
    )

    container.addMediaGalleryComponents(mediaGallery)

    container.addActionRowComponents(
        ticketWelcomeMessageButton({
            onHold,
            claimed
        })
    )

    footer({
        container
    })

    return {
        mainContainer: container,
        reasonContainer: reasonContainer({ subject })
    }
}

function reasonContainer({
    subject,
}: {
    subject: string;
}) {
    const container = new ContainerBuilder()

    container.addTextDisplayComponents(
        text(`# 📋 Opening Form`),
        text("**What is your concern?**"),
        text(
            subject.trim().split("\n")
                .map((e) => `\n > ${e}`).join("")
        )
    )

    return container
}