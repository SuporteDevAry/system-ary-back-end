import {
  Entity,
  Column,
  CreateDateColumn,
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

  @Column({ type: "jsonb", nullable: true, default: [] })
  seller: string[];

  @Column({ type: "jsonb", nullable: true, default: [] })
  buyer: string[];

  @Column({ type: "jsonb", nullable: true, default: [] })
  list_email_seller: string[];

  @Column({ type: "jsonb", nullable: true, default: [] })
  list_email_buyer: string[];

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

  @Column({ nullable: true })
  commission_seller: string;

  @Column({ nullable: true })
  commission_buyer: string;

  @Column()
  type_pickup: string;

  @Column()
  pickup: string;

  @Column()
  pickup_location: string;

  @Column()
  inspection: string;

  @Column({ nullable: true })
  observation: string;

  @Column()
  number_contract: string;

  @Column()
  owner_contract: string;

  @Column()
  type_commission_seller: string;

  @Column()
  type_commission_buyer: string;

  @Column("decimal")
  total_contract_value: number;

  @Column("jsonb", { nullable: true })
  status: {
    status_current: string;
    history: {
      date: string;
      time: string;
      status: string;
      owner_change: string;
    }[];
  };

  @Column({ nullable: true })
  contract_emission_date: string;

  @Column({ nullable: true })
  destination: string;

  @Column({ nullable: true })
  number_external_contract_buyer: string;

  @Column({ nullable: true })
  number_external_contract_seller: string;

  @Column({ nullable: true })
  day_exchange_rate: string;

  @Column({ nullable: true })
  payment_date: string;

  @Column({ nullable: true })
  farm_direct: string;

  @Column({ nullable: true })
  initial_pickup_date: string;

  @Column({ nullable: true })
  final_pickup_date: string;

  @Column({ nullable: true })
  internal_communication: string;

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
