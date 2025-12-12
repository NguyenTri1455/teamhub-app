import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DutyRotation } from "../entities/DutyRotation";
import { User } from "../entities/User";
import { In } from "typeorm";

class DutyRotationController {
    static get = async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(DutyRotation);
        // Singleton, assume ID 1
        let rotation = await repo.findOne({ where: { id: 1 } });

        if (!rotation) {
            // Init if not exists
            rotation = new DutyRotation();
            rotation.currentIndex = 0;
            rotation.memberOrder = [];
            await repo.save(rotation);
        }

        // Fetch members details
        const userRepo = AppDataSource.getRepository(User);
        let members: User[] = [];
        if (rotation.memberOrder.length > 0) {
            // rotation.memberOrder is string[] from simple-json, User.id is number
            const memberIds = rotation.memberOrder.map((id) => Number(id));
            members = await userRepo.findBy({
                id: In(memberIds)
            });

            // Sort members according to memberOrder
            const memberMap = new Map(members.map(u => [u.id, u]));
            members = rotation.memberOrder.map(id => memberMap.get(Number(id))).filter(u => u !== undefined) as User[];
        }

        res.send({ ...rotation, members });
    };

    static updateConfig = async (req: Request, res: Response) => {
        const { memberOrder } = req.body; // Array of IDs
        const repo = AppDataSource.getRepository(DutyRotation);

        let rotation = await repo.findOne({ where: { id: 1 } });
        if (!rotation) {
            rotation = new DutyRotation();
        }

        rotation.memberOrder = memberOrder;
        rotation.currentIndex = 0; // Reset index on config change

        try {
            await repo.save(rotation);

            const { getIO } = require("../socket");
            try { getIO().emit("duty:updated"); } catch (e) { }

            res.send(rotation);
        } catch (error) {
            res.status(500).send("Error updating rotation config");
        }
    };

    static completeTurn = async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(DutyRotation);
        const rotation = await repo.findOne({ where: { id: 1 } });

        if (!rotation || rotation.memberOrder.length === 0) {
            res.status(400).send("Rotation not configured");
            return;
        }

        rotation.currentIndex = (rotation.currentIndex + 1) % rotation.memberOrder.length;

        try {
            await repo.save(rotation);

            const { getIO } = require("../socket");
            try { getIO().emit("duty:updated"); } catch (e) { }

            res.send({ currentIndex: rotation.currentIndex });
        } catch (e) {
            res.status(500).send("Error completing turn");
        }
    };
}
export default DutyRotationController;
