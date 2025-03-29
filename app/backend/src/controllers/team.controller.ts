import { TeamDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import type { Request, Response } from "express";
import type { TeamService } from "../services/team.service";

export class TeamController {
	constructor(private service: TeamService) {}

	async getAll(_: Request, res: Response): Promise<void> {
		const teams = await this.service.getAll();
		res.status(200).json(teams.map((team) => plainToInstance(TeamDTO, team)));
	}
}
