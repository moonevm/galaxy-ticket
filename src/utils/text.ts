import {TextDisplayBuilder} from "discord.js";

export function text(text: string) {
    return new TextDisplayBuilder()
        .setContent(text)
}