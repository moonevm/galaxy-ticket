import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./handlers/commands.ts";
import { loadEvents } from "./handlers/events.ts";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN is not set (add it to .env)");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

await loadCommands();
await loadEvents(client);
await client.login(token);
