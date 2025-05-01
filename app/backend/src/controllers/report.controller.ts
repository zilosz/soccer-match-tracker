import { MatchFilterDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request, Response } from "express";
import type { ReportService } from "../services/report.service";

export class ReportController {
	constructor(private service: ReportService) {}

	async getStats(req: Request, res: Response): Promise<void> {
		const matchFilter = plainToInstance(MatchFilterDTO, req.body);
		const validation = await validate(matchFilter);

		if (validation.length > 0) {
			console.error(validation);
			res.status(400).send();
		} else {
			const stats = await this.service.getStats(matchFilter);
			res.status(200).json(stats);
		}
	}
}
