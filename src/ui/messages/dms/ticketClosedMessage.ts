import {ContainerBuilder, type Guild} from "discord.js";
import {text} from "../../../utils/text.ts";
import {formatDuration} from "../../../utils/formatDuration.ts";
import {footer} from "../../../utils/components/footer.ts";

export default function ticketClosed({
    ticketId,
    panelId,
    guild,
    createdAt,
    closedAt,
    closedBy,
    reason,
 }: {
    ticketId: string;
    panelId: string;
    guild: Guild,
    createdAt: Date;
    closedAt: Date;
    closedBy: string;
    reason: string;
}) {
    const container = new ContainerBuilder()

    const fields = [
        {
            name: "Case ID",
            value: `\`${ticketId}\``,
            emoji: "\t🎫"
        },
        {
            name: "Panel ID",
            value: `\`${panelId}\``,
            emoji: "📋"
        },
        {
            name: "Guild",
            value: `**[${guild.name}](https://discord.com/channels/${guild.id})**`,
            emoji: "🏠"
        },
        {
            name: "Processing time",
            value: formatDuration(createdAt, closedAt),
            emoji: "⏱️"
        },
        {
            name: "Created at",
            value: `<t:${Math.floor(+createdAt / 1000)}:F>`,
            emoji: "📅"
        },
        {
            name: "Reason",
            value: `\`${reason}\``,
            emoji: "📝"
        }
    ]

    container.addTextDisplayComponents(
        text("# 🎫 Your ticket has been closed!"),
        text(`<@${closedBy}> has closed your ticket on **${guild.name}**. We hope that your issue has been resolved!`),
    )

    container.addTextDisplayComponents(
        text(`
            \n\n
            ${fields.map((e) => `- ${e.emoji} **${e.name}:** ${e.value}`).join("\n")}
        `)
    )

    footer({
        container
    })

    return container
}