import type {
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export interface Command {
  data: {
    name: string;
    toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody;
  };
  execute(interaction: ChatInputCommandInteraction): unknown | Promise<unknown>;
}

export type EventHandler<E extends keyof ClientEvents> = (
  ...args: [...ClientEvents[E], Client<true>]
) => unknown | Promise<unknown>;

export const defineCommand = (command: Command): Command => command;

export const defineEvent = <E extends keyof ClientEvents>(handler: EventHandler<E>): EventHandler<E> =>
  handler;
