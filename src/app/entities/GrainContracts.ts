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

  @Column({ nullable: true })
  type_quantity: string;

  @Column("decimal")
  quantity: number;

  @Column("decimal")
  quantity_kg: number;

  @Column("decimal")
  quantity_bag: number;

  // "MI" (mercado interno, fluxo original) ou "A Fixar" (preço definido depois,
  // via fixações de mercado). Todo contrato existente antes desta coluna é "MI".
  @Column({ default: "MI" })
  type_contract: string;

  @Column({ nullable: true })
  type_currency: string;

  @Column("decimal", { nullable: true })
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

  @Column({ nullable: true })
  type_commission_seller: string;

  @Column({ nullable: true })
  type_commission_buyer: string;

  @Column("decimal", { nullable: true })
  total_contract_value: number;

  // Só usados por contratos "AF" — ver GrainFixationContractController.
  @Column({ nullable: true })
  fixation_status: string;

  @Column("decimal", { nullable: true })
  fixed_quantity: number;

  @Column("decimal", { nullable: true })
  average_fixed_price: number;

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
  complement_destination: string;

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

  @Column({ type: "uuid", nullable: true })
  table_id?: string;

  @Column("decimal", { nullable: true })
  final_quantity: number;

  @Column("decimal", { nullable: true })
  commission_contract: number;

  @Column("decimal", { nullable: true })
  commission_seller_contract_value: number;

  @Column("decimal", { nullable: true })
  commission_buyer_contract_value: number;

  @Column("decimal", { nullable: true })
  total_received: number;

  @Column({ nullable: true })
  status_received: string;

  @Column({ nullable: true })
  charge_date: string;

  @Column({ nullable: true })
  commission_receipt_date: string;

  @Column({ nullable: true })
  expected_receipt_date: string;

  @Column({ nullable: true })
  contract_emission_datetime: Date;

  @Column({ nullable: true })
  type_commission_seller_currency: string;

  @Column({ nullable: true })
  commission_seller_exchange_rate: string;

  @Column({ nullable: true })
  type_commission_buyer_currency: string;

  @Column({ nullable: true })
  commission_buyer_exchange_rate: string;

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
