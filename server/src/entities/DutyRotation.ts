import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class DutyRotation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    currentIndex: number

    @Column("simple-json")
    memberOrder: string[] // Array of User IDs
}
