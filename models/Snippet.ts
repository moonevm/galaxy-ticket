import {AllowNull, Column, DataType, Default, Model, PrimaryKey, Table} from "sequelize-typescript";
import {generateId} from "../src/utils/generateId.ts";
import type {InferAttributes, InferCreationAttributes} from "sequelize";

@Table({
    tableName: "snippets",
    modelName: "Snippet",
    paranoid: true,
})
export class Snippet extends Model<InferAttributes<Snippet>, InferCreationAttributes<Snippet>> {
    @Default(() => (generateId({ prefix: "#SN-" })))
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    declare id?: string;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare guildId: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare title: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare content: string;
}
