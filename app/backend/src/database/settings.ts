import type { DataSourceOptions } from "typeorm";
import type { SeederOptions } from "typeorm-extension";
import { CompetitionEntity } from "../entities/Competition.js";
import { MatchEntity } from "../entities/Match.js";
import { TeamEntity } from "../entities/Team.js";

export function getDbOptions() {
  return {
    type: "mysql",
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.MYSQL_DATABASE,
    host: process.env.DB_HOST,
    entities: [TeamEntity, CompetitionEntity, MatchEntity],
    synchronize: true,
    factories: ["src/database/factories/*.ts"],
    seeds: ["src/database/seeds/*.ts"],
  } as DataSourceOptions & SeederOptions;
}
