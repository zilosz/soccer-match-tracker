import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("competitions")
export class CompetitionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;
}
