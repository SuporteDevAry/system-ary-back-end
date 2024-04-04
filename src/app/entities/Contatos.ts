import {
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("contatos")
export class Contatos {

    @PrimaryColumn()
    id: string;

    @Column({ type: "text" })
    cli_codigo: string;

    @Column({ type: "text" })
    sequencia: string;

    @Column({ type: "text" })
    grupo: string;

    @Column({ type: "text" })
    nome: string;

    @Column({ type: "text" })
    cargo: string;

    @Column({ type: "text" })
    email: string;

    @Column({ type: "text" })
    telefone: string;

    @Column({ type: "text" })
    celular: string;

    @Column({ type: "text" })
    recebe_email: string;

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
