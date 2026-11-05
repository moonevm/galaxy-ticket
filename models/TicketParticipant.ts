import {AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {generateId} from "../src/utils/generateId.ts";
import type {InferAttributes, InferCreationAttributes, NonAttribute} from "sequelize";
import {Ticket} from "./Ticket.ts";

@Table({
    tableName: "ticket_participants",
    modelName: "TicketParticipant",
})
export class TicketParticipant extends Model<InferAttributes<TicketParticipant>, InferCreationAttributes<TicketParticipant>> {
    @Default(() => (generateId({ prefix: "#PA-" })))
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    declare id?: string;

    @ForeignKey(() => Ticket)
    @AllowNull(false)
    @Column(DataType.STRING)
    declare ticketId: string;

    @BelongsTo(() => Ticket, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    declare ticket?: NonAttribute<Ticket>;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare userId: string;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    declare addedBy: string;

    @Default(DataType.NOW)
    @AllowNull(false)
    @Column(DataType.DATE)
    declare addedAt?: Date;

    @AllowNull(true)
    @Column(DataType.DATE)
    declare removedAt?: Date;
}
