import { DataSource } from "typeorm";

export async function initDataSource(): Promise<DataSource> {
	return new DataSource({
		type: "mysql",
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		port: Number(process.env.DB_PORT),
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		entities: ["src/entities/*.ts"],
		synchronize: true,
	}).initialize();
}
