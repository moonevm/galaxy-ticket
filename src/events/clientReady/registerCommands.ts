import { commands } from "../../handlers/commands.ts";
import { defineEvent } from "../../types.ts";

export default defineEvent<"clientReady">(async (client) => {
  const body = commands.map((command) => command.data.toJSON());
  const guildId = process.env.GUILD_ID;

  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    await guild.commands.set(body);
    console.log(`[commands] Registered ${body.length} command(s) in guild ${guild.name}`);
  } else {
    await client.application.commands.set(body);
    console.log(`[commands] Registered ${body.length} global command(s)`);
  }
});
