import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("active_session")
export class ActiveSession {
  @PrimaryColumn({ type: "uuid" })
  user_id: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "timestamp" })
  last_seen_at: Date;
}
