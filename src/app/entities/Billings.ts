import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeUpdate,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("billings")
export class Billing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  number_contract: string;

  @Column()
  product_name: string;

  @Column()
  number_broker: string;

  @Column()
  year: string;

  @Column("timestamp")
  receipt_date: Date;

  @Column()
  internal_receipt_number: string;

  @Column()
  rps_number: string;

  @Column()
  nfs_number: string;

  @Column("decimal")
  total_service_value: string;

  @Column("decimal")
  irrf_value: string;

  @Column("decimal")
  adjustment_value: string;

  @Column("decimal")
  liquid_value: string;

  @Column()
  liquid_contract: string;

  @Column("timestamp")
  expected_receipt_date: Date;

  @Column("timestamp")
  liquid_contract_date: Date;

  @Column()
  owner_record: string;

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
