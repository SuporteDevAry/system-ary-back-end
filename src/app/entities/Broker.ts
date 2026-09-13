import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeUpdate,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("broker")
export class Broker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  mesa: string;

  @Column()
  broker: string;

  @Column()
  product: string;

  @Column()
  broker_name: string;

  @Column()
  broker_nick: string;

  @Column()
  broker_abbrev: string;

  @Column()
  company_name: string;

  @Column()
  cnpj_cpf: string;

  @Column()
  bank_number: string;

  @Column()
  bank_name: string;

  @Column()
  ag_number: string;

  @Column()
  account_number: string;

  @Column()
  date_ini: string;

  @Column()
  date_fin: string;

  @Column("decimal")
  commision: number;

  @Column()
  cctipo: string;

  @Column("decimal")
  ccdesconto: number;

  @Column()
  sca: string;

  @Column("decimal")
  aj_prolab: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
