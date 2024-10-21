import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("client")
export class Client {
  @PrimaryColumn()
  id: string;

  @Index({ unique: true })
  @Generated("increment")
  @Column({ type: "int" })
  @Column()
  code_client: number;

  @Column({ type: "text" })
  nickname: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  address: string;

  @Column({ type: "text" })
  number: string;

  @Column({ type: "text" })
  complement: string;

  @Column({ type: "text" })
  district: string;

  @Column({ type: "text" })
  city: string;

  @Column({ type: "text" })
  state: string;

  @Column({ type: "text" })
  zip_code: string;

  @Column({ type: "text" })
  kind: string;

  @Column({ type: "text" })
  cnpj_cpf: string;

  @Column({ type: "text" })
  ins_est: string;

  @Column({ type: "text" })
  ins_mun: string;

  @Column({ type: "text" })
  telephone: string;

  @Column({ type: "text" })
  cellphone: string;

  @Column({ type: "text" })
  situation: string;

  @Column({ type: "jsonb", nullable: true, default: [] })
  account: string[];

  @Column({ nullable: true })
  cnpj_pagto: string;

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
