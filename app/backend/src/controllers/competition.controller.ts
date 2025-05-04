import { CompetitionDTO } from "@project/shared";
import { plainToInstance } from "class-transformer";
import type { Request, Response } from "express";
import type { CompetitionService } from "../services/competition.service.js";

export class CompetitionController {
  constructor(private service: CompetitionService) {}

  async getAll(_: Request, res: Response): Promise<void> {
    const comps = await this.service.getAll();
    res.status(200).json(comps.map((c) => plainToInstance(CompetitionDTO, c)));
  }
}
