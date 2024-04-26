import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("clientes")
export class Clientes {
  @PrimaryColumn()
  id: string;

  @Index({ unique: true })
  @Column({ type: "text" })
  cli_codigo: string;

  @Column({ type: "text" })
  nome: string;

  @Column({ type: "text" })
  endereco: string;

  @Column({ type: "text" })
  numero: string;

  @Column({ type: "text" })
  complemento: string;

  @Column({ type: "text" })
  bairro: string;

  @Column({ type: "text" })
  cidade: string;

  @Column({ type: "text" })
  uf: string;

  @Column({ type: "text" })
  cep: string;

  @Column({ type: "text" })
  natureza: string;

  @Column({ type: "text" })
  cnpj: string;

  @Column({ type: "text" })
  ins_est: string;

  @Column({ type: "text" })
  ins_mun: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  telefone: string;

  @Column({ type: "text" })
  celular: string;

  @Column({ type: "text" })
  situacao: string;

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
