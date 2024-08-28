import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("contact")
export class Contact {
  @PrimaryColumn()
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  sector: string;

  @Column({ type: "text" })
  telephone: string;

  @Column({ type: "text" })
  cellphone: string;

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

  @Column({ type: "int" })
  code_client: number;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
