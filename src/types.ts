import type {
  ButtonInteraction,
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

type ButtonExecute = (interaction: ButtonInteraction) => unknown | Promise<unknown>;

export type Button =
  | { id: string; validate?: never; execute: ButtonExecute }
  | { id?: never; validate(interaction: ButtonInteraction): boolean | Promise<boolean>; execute: ButtonExecute };

export const defineCommand = (command: Command): Command => command;

export const defineButton = (button: Button): Button => button;

export const defineEvent = <E extends keyof ClientEvents>(handler: EventHandler<E>): EventHandler<E> =>
  handler;
