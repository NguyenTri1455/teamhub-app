import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { BeerParty, BeerPartyParticipant } from "../entities/BeerParty";

class BeerPartyController {
    static getActive = async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(BeerParty);
        const party = await repo.findOne({
            where: { status: "active" },
            relations: ["participants"],
            order: { createdAt: "DESC" } // Get latest active
        });
        res.send(party || null);
    };

    static create = async (req: Request, res: Response) => {
        const { selectedMembers } = req.body; // Array of { id, name, avatar }

        const party = new BeerParty();
        party.participants = selectedMembers.map((m: any) => {
            const p = new BeerPartyParticipant();
            p.memberId = m.id;
            p.name = m.name;
            p.avatar = m.avatar;
            p.count = 0;
            return p;
        });

        const repo = AppDataSource.getRepository(BeerParty);
        try {
            await repo.save(party);
            res.status(201).send(party);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error creating party");
        }
    };

    static updateCount = async (req: Request, res: Response) => {
        const { partyId, memberId, newCount } = req.body;

        if (newCount < 0) {
            res.status(400).send("Count cannot be negative");
            return;
        }

        await AppDataSource.transaction(async manager => {
            const partyRepo = manager.getRepository(BeerParty);
            const party = await partyRepo.findOne({
                where: { id: partyId },
                relations: ["participants"]
            });

            if (!party) {
                res.status(404).send("Party not found");
                return;
            }

            const participant = party.participants.find(p => p.memberId === memberId);
            if (participant) {
                participant.count = newCount;
            }

            // Recalculate total
            party.totalCount = party.participants.reduce((sum, p) => sum + p.count, 0);

            await manager.save(party); // cascades to participants
            res.send(party);
        });
    };

    static end = async (req: Request, res: Response) => {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(BeerParty);

        try {
            await repo.update(id, {
                status: "finished",
                endedAt: new Date()
            });
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error);
        }
    };
}
export default BeerPartyController;
