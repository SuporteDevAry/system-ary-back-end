import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("email_logs")
export class EmailLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email_sender: string;

  @Column()
  number_contract: string;

  @CreateDateColumn()
  sent_at: Date;
}
