import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("audit_log")
export class AuditLog {
  @PrimaryColumn()
  id: string;

  @Column({ type: "uuid", nullable: true })
  user_id: string | null;

  @Column({ type: "text" })
  user_email: string;

  @Column({ type: "text" })
  user_name: string;

  @Column({ type: "varchar" })
  action: "INSERT" | "UPDATE" | "REMOVE";

  @Column({ type: "varchar" })
  entity_name: string;

  @Column({ type: "varchar", nullable: true })
  entity_id: string | null;

  @Column({ type: "jsonb", nullable: true })
  before: Record<string, unknown> | null;

  @Column({ type: "jsonb", nullable: true })
  after: Record<string, unknown> | null;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
