import { ActivityType } from "discord.js";
import { defineEvent } from "../../types.ts";

export default defineEvent<"clientReady">((client) => {
    client.user.setActivity({
        name: "github.com/moonevm/galaxy-ticket",
        type: ActivityType.Watching,
    })
});
