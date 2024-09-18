import {
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("notifications")
export class Notifications {

    @PrimaryColumn()
    id: string;

    @Column({ type: "text" })
    user: string;

    @Column({ type: "boolean" })
    read: boolean;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "text" })
    type: string;

    @Column({ type: "boolean" })
    isLoading: boolean;

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
