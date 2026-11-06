import { Cluster } from "galactic.ts";
import { Client, type ClientOptions } from "discord.js";
import { loadCommands } from "./handlers/commands.ts";
import { loadEvents } from "./handlers/events.ts";
import { sequelize } from "./utils/db.ts";
import {loadButtons} from "./handlers/buttons.ts";
import { loadModals } from "./handlers/modals.ts";

export class ExtendedClient extends Client {
    cluster: Cluster<ExtendedClient>;

    constructor(options: ClientOptions, cluster: Cluster<ExtendedClient>) {
        super(options);
        this.cluster = cluster;
    }
}

const cluster = Cluster.initial<ExtendedClient>();

const client = new ExtendedClient(
    {
        shards: cluster.shardList,
        shardCount: cluster.totalShards,
        intents: cluster.intents,
    },
    cluster,
);

cluster.client = client;

process.on("disconnect", () => {
    client.destroy().finally(() => process.exit(0));
});

await sequelize.authenticate();
await loadCommands();
await loadEvents(client);
await loadButtons();
await loadModals();
await client.login(cluster.token);