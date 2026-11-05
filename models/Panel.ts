import {AllowNull, Column, DataType, Default, Model, PrimaryKey, Table} from "sequelize-typescript";
import {generateId} from "../src/utils/generateId.ts";
import type {InferAttributes, InferCreationAttributes} from "sequelize";

@Table({
    tableName: "panels",
    modelName: "Panel",
})
export class Panel extends Model<InferAttributes<Panel>, InferCreationAttributes<Panel>> {
    @Default(() => (generateId({ prefix: "#P-" })))
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    declare id?: string;

    @AllowNull(false)
    @Column(DataType.STRING)
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
    declare description?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare imageUrl?: string;

    @Default("Create Ticket")
    @AllowNull(false)
    @Column(DataType.STRING)
    declare buttonLabel?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare welcomeMessage?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare welcomeImageUrl?: string;

    @Default(1)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare maxOpenTicketsPerUser?: number;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare deleteChannelOnClose?: boolean;
}