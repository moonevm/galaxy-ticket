import {
    type ContainerBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize
} from "discord.js";
import images from "../images.ts";

type ImageType = "PRIDE" | "DEFAULT"

export function footer({
    container,
    imageType = "PRIDE"
                       }: {
    container?: ContainerBuilder,
    imageType?: ImageType
}) {
    const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
    const mediaGallery = new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder()
            .setURL(
                imageType === "DEFAULT" ?
                    images.EMBED_FOOTER_DEFAULT
                : imageType === "PRIDE" ?
                    images.EMBED_FOOTER_PRIDE
                : ""
            )
    )

    if (container) {
        container.addSeparatorComponents(separator);

        container.addMediaGalleryComponents(
            mediaGallery
        );

        return container
    } else {
        return [separator, mediaGallery]
    }
}