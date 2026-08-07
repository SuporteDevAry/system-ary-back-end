import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { GrainContract } from "./GrainContracts";

@Entity("grain_contract_fixation_items")
export class GrainContractFixationItem {
  @PrimaryColumn()
  id: string;

  @Column({ type: "uuid" })
  fixation_contract_id: string;

  @ManyToOne(() => GrainContract, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fixation_contract_id" })
  fixationContract?: GrainContract;

  // Número único da fixação: número do contrato pai + sequencial (ex.: "S.007-F001/26-01").
  @Column({ unique: true })
  number_contract: string;

  @Column("decimal")
  quantity: number;

  // Preço/saca já calculado (BRL) — ver fórmula em addFixationItem. Não é
  // digitado pelo usuário, é derivado de cbot_value/premium/conversion_factor/
  // fobbings/exchange_rate.
  @Column("decimal")
  price: number;

  @Column()
  type_currency: string;

  @Column({ nullable: true })
  exchange_rate: string;

  // Data de referência do câmbio usado (ex.: "Câmbio Pagamento 30/04/26"),
  // pode ser diferente da data da fixação em si.
  @Column({ nullable: true })
  exchange_rate_date: string;

  @Column()
  fixation_date: string;

  // Mês/ano de referência exibido na Memória de Cálculo (ex.: "Maio/26").
  @Column({ nullable: true })
  reference_month: string;

  // Código do contrato futuro na bolsa (ex.: "SK6").
  @Column({ nullable: true })
  cbot_code: string;

  @Column("decimal", { nullable: true })
  cbot_value: number;

  // Prêmio/deságio sobre o CBOT (pode ser negativo).
  @Column("decimal", { nullable: true })
  premium: number;

  // Fator de conversão bushel/tonelada (ex.: 0,367454 para soja).
  @Column("decimal", { nullable: true })
  conversion_factor: number;

  // Custo de FOBbing por tonelada.
  @Column("decimal", { nullable: true })
  fobbings: number;

  // PPE = Preço de Paridade de Exportação (USD/tonelada), calculado:
  // (cbot_value + premium) * conversion_factor - fobbings.
  @Column("decimal", { nullable: true })
  ppe_usd: number;

  // Preço por saca de 60kg em USD, antes da conversão cambial: ppe_usd / 16,6667.
  @Column("decimal", { nullable: true })
  price_usd_per_saca: number;

  @Column("decimal", { nullable: true })
  item_value: number;

  @Column({ nullable: true })
  created_by_name: string;

  @Column({ nullable: true })
  created_by_email: string;

  // Metadados do PDF de confirmação gerado no front-end para esta fixação
  // (o arquivo em si não é armazenado no backend, só é regerado sob demanda).
  @Column({ nullable: true })
  pdf_file_name: string;

  @Column("decimal", { nullable: true })
  pdf_file_size_kb: number;

  @Column("int", { nullable: true })
  pdf_pages: number;

  @Column({ default: false })
  email_sent: boolean;

  @Column({ type: "timestamp", nullable: true })
  email_sent_at: Date;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
