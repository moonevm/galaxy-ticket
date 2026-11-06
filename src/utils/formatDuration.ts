export function formatDuration(start: Date, end: Date) {
    const totalSeconds = Math.floor(Math.abs(end.getTime() - start.getTime()) / 1000)

    const units = [
        { label: "d", value: Math.floor(totalSeconds / 86400) },
        { label: "h", value: Math.floor(totalSeconds % 86400 / 3600) },
        { label: "m", value: Math.floor(totalSeconds % 3600 / 60) },
        { label: "s", value: totalSeconds % 60 },
    ]

    const parts = units
        .filter((unit) => unit.value > 0)
        .map((unit) => `${unit.value}${unit.label}`)

    return parts.length > 0 ? parts.join(" ") : "0s"
}