import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Invitation } from "../entities/Invitation";

class InvitationController {
    static list = async (req: Request, res: Response) => {
        const repo = AppDataSource.getRepository(Invitation);
        try {
            const list = await repo.find({
                order: { invitedAt: "DESC" }
            });
            res.send(list);
        } catch (error) {
            res.status(500).send("Error fetching invitations");
        }
    };

    static add = async (req: Request, res: Response) => {
        const { email, invitedBy } = req.body;
        const repo = AppDataSource.getRepository(Invitation);

        const invitation = new Invitation();
        invitation.email = email.toLowerCase();
        invitation.invitedBy = invitedBy;

        try {
            await repo.save(invitation);
            res.status(201).send(invitation);
        } catch (error) {
            res.status(400).send("Error adding invitation");
        }
    };

    static delete = async (req: Request, res: Response) => {
        const { email } = req.params;
        const repo = AppDataSource.getRepository(Invitation);
        try {
            await repo.delete(email);
            res.status(204).send();
        } catch (error) {
            res.status(500).send("Error deleting invitation");
        }
    };
}
export default InvitationController;
