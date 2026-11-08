import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import {generateId} from "../src/utils/generateId.ts";
import type {InferAttributes, InferCreationAttributes, NonAttribute} from "sequelize";
import {Panel} from "./Panel.ts";
import {TicketParticipant} from "./TicketParticipant.ts";

export const TICKET_STATUSES = ["open", "claimed", "on_hold", "closed"] as const;
export type TicketStatus = typeof TICKET_STATUSES[number];

@Table({
    tableName: "tickets",
    modelName: "Ticket",
})
export class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
    @Default(() => (generateId({ prefix: "#T-" })))
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    declare id?: string | null;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare guildId: string;

    @ForeignKey(() => Panel)
    @AllowNull(true)
    @Column(DataType.STRING)
    declare panelId?: string | null;

    @BelongsTo(() => Panel, { onDelete: "SET NULL", onUpdate: "CASCADE" })
    declare panel?: NonAttribute<Panel>;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare channelId: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare messageId: string;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare creatorId: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare subject: string;

    @Default("open")
    @AllowNull(false)
    @Column(DataType.ENUM(...TICKET_STATUSES))
    declare status?: TicketStatus;

    @AllowNull(true)
    @Column(DataType.BIGINT)
    declare claimedBy?: string | null;

    @AllowNull(true)
    @Column(DataType.DATE)
    declare claimedAt?: Date | null;

    @AllowNull(true)
    @Column(DataType.BIGINT)
    declare onHoldBy?: string | null;

    @AllowNull(true)
    @Column(DataType.DATE)
    declare onHoldAt?: Date | null;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare onHoldReason?: string | null;

    @AllowNull(true)
    @Column(DataType.BIGINT)
    declare closedBy?: string | null;

    @AllowNull(true)
    @Column(DataType.DATE)
    declare closedAt?: Date | null;

    @Default("No reason provided")
    @AllowNull(true)
    @Column(DataType.TEXT)
    declare closeReason?: string | null;

    @HasMany(() => TicketParticipant)
    declare participants?: NonAttribute<TicketParticipant[]>;
}
