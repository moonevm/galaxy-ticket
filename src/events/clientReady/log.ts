import { defineEvent } from "../../types.ts";

export default defineEvent<"clientReady">((client) => {
  console.log(`Logged in as ${client.user.tag}`);
});
