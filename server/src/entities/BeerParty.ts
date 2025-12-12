import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class BeerParty {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @Column({ default: "active" })
    status: string

    @Column({ nullable: true })
    endedAt: Date

    @Column({ default: 0 })
    totalCount: number

    @OneToMany(() => BeerPartyParticipant, (participant) => participant.party, { cascade: true })
    participants: BeerPartyParticipant[]
}

@Entity()
export class BeerPartyParticipant {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    partyId: number

    @ManyToOne(() => BeerParty, (party) => party.participants)
    @JoinColumn({ name: "partyId" })
    party: BeerParty

    @Column()
    memberId: number // Keeping it as number assumption User.id is number. If UUID, change to string.

    // Optional: Relation to User if we want to fetch user details eagerly
    // @ManyToOne(() => User)
    // @JoinColumn({ name: "memberId" })
    // user: User

    @Column()
    name: string

    @Column({ nullable: true })
    avatar: string

    @Column({ default: 0 })
    count: number
}
