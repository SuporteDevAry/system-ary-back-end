import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeUpdate,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  rps_number: string;

  @Column()
  rps_emission_date: string;

  @Column()
  nfs_number: string;

  @Column()
  nfs_emission_date: string;

  @Column()
  service_code: string;

  @Column("decimal")
  aliquot: string;

  @Column({ type: "text" })
  cpf_cnpj: string;

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
  email: string;

  @Column({ type: "text" })
  service_discrim: string;

  @Column("decimal")
  service_value: string;

  @Column()
  name_adjust1: string;

  @Column("decimal")
  value_adjust1: string;

  @Column()
  name_adjust2: string;

  @Column("decimal")
  value_adjust2: string;

  @Column("decimal")
  deduction_value: string;

  @Column("decimal")
  irrf_value: string;

  @Column("decimal")
  service_liquid_value: string;

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
