import { EmbedBuilder } from "discord.js";

export default function errorMessage(error: string) {
    return {
        embeds: [
            new EmbedBuilder()
                .setTitle("❌ Something went wrong")
                .setDescription(`\`${error}\``)
        ],
        flags: ["Ephemeral"] as ["Ephemeral"]
    }
}
