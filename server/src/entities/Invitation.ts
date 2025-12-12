import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Invitation {
    @PrimaryColumn()
    email: string

    @Column()
    invitedBy: string

    @CreateDateColumn()
    invitedAt: Date

    @Column({ default: "pending" })
    status: string
}
