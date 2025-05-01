import { MatchDTO, MatchDTONoId } from "@project/shared";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Request, Response } from "express";
import type { MatchService } from "../services/match.service";

export class MatchController {
	constructor(private service: MatchService) {}

	async getAll(_: Request, res: Response): Promise<void> {
		const matches = await this.service.getAll();
		res.status(200).json(matches.map((m) => plainToInstance(MatchDTO, m)));
	}

	async create(req: Request, res: Response): Promise<void> {
		const matchDTO = plainToInstance(MatchDTONoId, req.body);
		const validation = await validate(matchDTO);

		if (validation.length > 0) {
			console.error(validation);
			res.status(400).send();
		} else if (Object.prototype.hasOwnProperty.call(matchDTO, "id")) {
			console.error("To-be-created match already has an ID.");
			res.status(400).send();
		} else {
			const match = await this.service.create(matchDTO);
			res.status(200).json(plainToInstance(MatchDTO, match));
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const matchDTO = plainToInstance(MatchDTO, req.body);
		const validation = await validate(matchDTO);

		if (validation.length > 0) {
			console.error(validation);
			res.status(400).send();
		} else {
			const result = await this.service.update(matchDTO);
			res.status(result.affected === 1 ? 204 : 400).send();
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const result = await this.service.delete(Number(req.params.id));
		res.status(result.affected === 1 ? 204 : 400).send();
	}
}
