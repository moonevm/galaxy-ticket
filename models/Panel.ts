import {AllowNull, Column, DataType, Default, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {generateId} from "../src/utils/generateId.ts";
import type {InferAttributes, InferCreationAttributes, NonAttribute} from "sequelize";
import {Ticket} from "./Ticket.ts";

@Table({
    tableName: "panels",
    modelName: "Panel",
})
export class Panel extends Model<InferAttributes<Panel>, InferCreationAttributes<Panel>> {
    @Default(() => (generateId({ prefix: "#P-" })))
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    declare id?: string | null;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare guildId: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare title: string;

    @Default("This panel has no description")
    @AllowNull(false)
    @Column(DataType.TEXT)
    declare description?: string | null;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare imageUrl?: string | null;

    @Default("Create Ticket")
    @AllowNull(false)
    @Column(DataType.STRING)
    declare buttonLabel?: string | null;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare welcomeTitle: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare welcomeMessage?: string | null;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare welcomeImageUrl?: string | null;

    @Default(1)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare maxOpenTicketsPerUser?: number | null;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare deleteChannelOnClose?: boolean | null;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare supportRoleId: string;

    @AllowNull(true)
    @Column(DataType.BIGINT)
    declare channelParentId?: string | null;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare pingSupporter?: string | null;

    @HasMany(() => Ticket)
    declare tickets?: NonAttribute<Ticket[]>;
}