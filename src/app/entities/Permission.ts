import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

interface Rule {
  permissions: string[];
}

@Entity("permissions")
export class Permission {
  @PrimaryColumn()
  id: string;

  @Column({ type: "jsonb", nullable: true, default: [] })
  rules: Rule[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
