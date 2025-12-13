import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class GlobalSetting {
    @PrimaryColumn()
    key: string

    @Column()
    value: string
}
