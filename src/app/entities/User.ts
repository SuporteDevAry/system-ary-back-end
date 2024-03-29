import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Permission } from "./Permission";

@Entity("users")
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "uuid" })
  permissions_id: string;

  @OneToOne(() => Permission)
  @JoinColumn({ name: "permissions_id" })
  permissions: Permission;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
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
