import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("login_history")
export class LoginHistory {
  @PrimaryColumn()
  id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  ip_address: string | null;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
