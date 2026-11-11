import {defineSubcommand} from "../../types.ts";
import {
    ChannelType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandSubcommandBuilder,
    type ChatInputCommandInteraction,
} from "discord.js";
import {Op} from "sequelize";
import {errorMessage} from "../../utils/messages.ts";
import {Panel} from "../../../models/Panel.ts";

type Parsed = { value: string | number | boolean } | { error: string };

type Setting = {
    label: string;
    nullable?: boolean;
    suggestions?: string[];
    parse(input: string, interaction: ChatInputCommandInteraction): Parsed | Promise<Parsed>;
};

const text = (max: number) => (input: string): Parsed =>
    input.length > max ? { error: `must be at most ${max} characters` } : { value: input };

const url = (input: string): Parsed => {
    try {
        const { protocol } = new URL(input);
        if (protocol === "http:" || protocol === "https:") return { value: input };
    } catch {}
    return { error: "must be a valid http(s) URL" };
};

const positiveInt = (input: string): Parsed => {
    const value = Number(input);
    return Number.isInteger(value) && value >= 1
        ? { value }
        : { error: "must be a whole number of at least 1" };
};

const bool = (input: string): Parsed => {
    const v = input.toLowerCase();
    if (["true", "yes", "on", "1"].includes(v)) return { value: true };
    if (["false", "no", "off", "0"].includes(v)) return { value: false };
    return { error: "must be `true` or `false`" };
};

const snowflake = (input: string) => input.match(/^(?:<@&|<#)?(\d{17,20})>?$/)?.[1];

const role = async (input: string, interaction: ChatInputCommandInteraction): Promise<Parsed> => {
    const id = snowflake(input);
    const found = id ? await interaction.guild?.roles.fetch(id).catch(() => null) : null;
    return found ? { value: found.id } : { error: "must be a role mention or role ID from this server" };
};

const category = async (input: string, interaction: ChatInputCommandInteraction): Promise<Parsed> => {
    const id = snowflake(input);
    const channel = id ? await interaction.guild?.channels.fetch(id).catch(() => null) : null;
    return channel?.type === ChannelType.GuildCategory
        ? { value: channel.id }
        : { error: "must be the ID of a category in this server" };
};

const booleans = ["true", "false"];

const settings = {
    name:                  { label: "Name",                      parse: text(255) },
    title:                 { label: "Panel title",               parse: text(255) },
    description:           { label: "Panel description",         parse: text(2000) },
    imageUrl:              { label: "Panel image URL",           parse: url, nullable: true },
    buttonLabel:           { label: "Button label",              parse: text(80) },
    welcomeTitle:          { label: "Welcome title",             parse: text(255) },
    welcomeMessage:        { label: "Welcome message",           parse: text(2000), nullable: true },
    welcomeImageUrl:       { label: "Welcome image URL",         parse: url, nullable: true },
    maxOpenTicketsPerUser: { label: "Max open tickets per user", parse: positiveInt },
    deleteChannelOnClose:  { label: "Delete channel on close",   parse: bool, suggestions: booleans },
    supportRoleId:         { label: "Support role",              parse: role },
    channelParentId:       { label: "Ticket category",           parse: category, nullable: true },
    pingSupporter:         { label: "Ping supporter",            parse: bool, suggestions: booleans },
} satisfies Record<string, Setting>;

type SettingKey = keyof typeof settings;

const isSettingKey = (key: string | null): key is SettingKey => !!key && key in settings;

export default defineSubcommand({
    command: "setting",
    parentDescription: "Manage panel settings",
    data: new SlashCommandSubcommandBuilder()
        .setName("change")
        .setDescription("Change a setting of a panel")
        .addStringOption((e) => e
            .setName("panel")
            .setDescription("Start typing a panel name")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((e) => e
            .setName("setting")
            .setDescription("The setting to change")
            .setRequired(true)
            .addChoices(Object.entries(settings).map(([key, { label }]) => ({ name: label, value: key })))
        )
        .addStringOption((e) => e
            .setName("value")
            .setDescription("The new value, leave empty to clear")
            .setMaxLength(2000)
            .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        if (!interaction.guildId) return interaction.respond([]);

        const focused = interaction.options.getFocused(true);
        const search = focused.value.trim();

        if (focused.name === "panel") {
            const panels = await Panel.findAll({
                where: {
                    guildId: interaction.guildId,
                    ...(search && { name: { [Op.iLike]: `%${search}%` } }),
                },
                order: [["name", "ASC"]],
                limit: 25,
            });

            return interaction.respond(panels.map((panel) => ({
                name: `${panel.name} (${panel.id})`.slice(0, 100),
                value: panel.id!,
            })));
        }

        if (focused.name === "value") {
            const key = interaction.options.getString("setting");
            if (!isSettingKey(key)) return interaction.respond([]);

            const setting: Setting = settings[key];
            if (setting.suggestions) {
                return interaction.respond(setting.suggestions
                    .filter((s) => s.startsWith(search.toLowerCase()))
                    .map((s) => ({ name: s, value: s })));
            }

            if (search) return interaction.respond([]);

            const panelId = interaction.options.getString("panel");
            const panel = panelId
                ? await Panel.findOne({ where: { id: panelId, guildId: interaction.guildId } })
                : null;
            const current = panel?.get(key);

            if (current === null || current === undefined || String(current).length > 100)
                return interaction.respond([]);

            return interaction.respond([{
                name: `Current: ${current}`.slice(0, 100),
                value: String(current),
            }]);
        }

        return interaction.respond([]);
    },

    async execute(interaction) {
        if (!interaction.guildId)
            return interaction.reply(errorMessage("Run this command in a server"));

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild))
            return interaction.reply(errorMessage("You need the **Manage Server** permission to change settings"));

        const panelId = interaction.options.getString("panel", true);
        const key = interaction.options.getString("setting", true);
        const input = interaction.options.getString("value")?.trim();

        if (!isSettingKey(key))
            return interaction.reply(errorMessage("Unknown setting"));

        const setting: Setting = settings[key];

        const panel = await Panel.findOne({
            where: {
                id: panelId,
                guildId: interaction.guildId,
            },
        });

        if (!panel)
            return interaction.reply(errorMessage("Panel not found"));

        let value: string | number | boolean | null = null;

        if (input) {
            const parsed = await setting.parse(input, interaction);
            if ("error" in parsed)
                return interaction.reply(errorMessage(`**${setting.label}** ${parsed.error}`));
            value = parsed.value;
        } else if (!setting.nullable) {
            return interaction.reply(errorMessage(`**${setting.label}** can't be empty`));
        }

        panel.set(key, value as never);
        await panel.save();

        await interaction.reply({
            content: value === null
                ? `Cleared **${setting.label}** of panel **${panel.name}**`
                : `Set **${setting.label}** of panel **${panel.name}** to \`${String(value).slice(0, 100)}\``,
            flags: MessageFlags.Ephemeral,
        });
    },
});
