import type {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  ModalSubmitInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandSubcommandBuilder,
} from "discord.js";

export interface Command {
  data: {
    name: string;
    toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody;
  };
  execute?(interaction: ChatInputCommandInteraction): unknown | Promise<unknown>;
  autocomplete?(interaction: AutocompleteInteraction): unknown | Promise<unknown>;
}

export interface Subcommand {
  command: string;
  parentDescription?: string;
  data: SlashCommandSubcommandBuilder;
  execute(interaction: ChatInputCommandInteraction): unknown | Promise<unknown>;
  autocomplete?(interaction: AutocompleteInteraction): unknown | Promise<unknown>;
}

export type EventHandler<E extends keyof ClientEvents> = (
  ...args: [...ClientEvents[E], Client<true>]
) => unknown | Promise<unknown>;

type ButtonExecute = (interaction: ButtonInteraction) => unknown | Promise<unknown>;

export type Button =
  | { id: string; validate?: never; execute: ButtonExecute }
  | { id?: never; validate(interaction: ButtonInteraction): boolean | Promise<boolean>; execute: ButtonExecute };

type ModalExecute = (interaction: ModalSubmitInteraction) => unknown | Promise<unknown>;

export type Modal =
  | { id: string; validate?: never; execute: ModalExecute }
  | { id?: never; validate(interaction: ModalSubmitInteraction): boolean | Promise<boolean>; execute: ModalExecute };

export const defineCommand = (command: Command): Command => command;

export const defineSubcommand = (subcommand: Subcommand): Subcommand => subcommand;

export const defineButton = (button: Button): Button => button;

export const defineModal = (modal: Modal): Modal => modal;

export const defineEvent = <E extends keyof ClientEvents>(handler: EventHandler<E>): EventHandler<E> =>
  handler;
