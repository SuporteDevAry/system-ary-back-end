import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeUpdate,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("grain_contracts")
export class GrainContract {
  @PrimaryColumn()
  id: string;

  @Column()
  number_broker: string;

  @Column()
  seller: string;

  @Column()
  buyer: string;

  @Column()
  list_email_seller: string;

  @Column()
  list_email_buyer: string;

  @Column()
  product: string;

  @Column()
  name_product: string;

  @Column()
  crop: string;

  @Column()
  quality: string;

  @Column("decimal")
  quantity: number;

  @Column("decimal")
  quantity_kg: number;

  @Column("decimal")
  quantity_bag: number;

  @Column()
  type_currency: string;

  @Column("decimal")
  price: number;

  @Column()
  type_icms: string;

  @Column()
  icms: string;

  @Column()
  payment: string;

  @Column("decimal")
  commission_seller: number;

  @Column("decimal")
  commission_buyer: number;

  @Column()
  type_pickup: string;

  @Column()
  pickup: string;

  @Column()
  pickup_location: string;

  @Column()
  inspection: string;

  @Column()
  observation: string;

  @Column()
  number_contract: string;

  @Column()
  owner_broker: string;

  @Column("decimal")
  contract_value: number;

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
