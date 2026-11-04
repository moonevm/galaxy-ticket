import type {
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export interface Command {
  /** A SlashCommandBuilder (or anything with a name and toJSON). */
  data: {
    name: string;
    toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody;
  };
  execute(interaction: ChatInputCommandInteraction): unknown | Promise<unknown>;
}

/**
 * An event handler receives the event's arguments, followed by the ready client.
 * The event it listens to is decided by the folder it lives in.
 */
export type EventHandler<E extends keyof ClientEvents> = (
  ...args: [...ClientEvents[E], Client<true>]
) => unknown | Promise<unknown>;

/** Typed helper for command files: `export default defineCommand({ data, execute })` */
export const defineCommand = (command: Command): Command => command;

/** Typed helper for event files: `export default defineEvent<"interactionCreate">((interaction) => {...})` */
export const defineEvent = <E extends keyof ClientEvents>(handler: EventHandler<E>): EventHandler<E> =>
  handler;
