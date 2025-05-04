import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CompetitionEntity } from "./Competition.js";
import { TeamEntity } from "./Team.js";

@Entity("matches")
export class MatchEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("date")
  date!: Date;

  @ManyToOne(() => CompetitionEntity)
  competition!: CompetitionEntity;

  @ManyToOne(() => TeamEntity)
  homeTeam!: TeamEntity;

  @ManyToOne(() => TeamEntity)
  awayTeam!: TeamEntity;

  @Column("int")
  homeGoals!: number;

  @Column("int")
  awayGoals!: number;
}
