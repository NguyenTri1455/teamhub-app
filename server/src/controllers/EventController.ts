import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Event } from "../entities/Event";
import { getIO } from "../socket";

class EventController {
    static list = async (req: Request, res: Response) => {
        const eventRepository = AppDataSource.getRepository(Event);
        // Get events from today onwards, ordered by date
        // Note: SQLite date comparison might need string handling if not standard.
        // TypeORM handles Date -> basic ISO string usually.
        // For simplicity: fetch all or sort in JS if needed, but TypeORM query is better.

        try {
            const events = await eventRepository
                .createQueryBuilder("event")
                .where("event.eventTimestamp >= :today", { today: new Date() })
                .orderBy("event.eventTimestamp", "ASC")
                .getMany();
            res.send(events);
        } catch (error) {
            res.status(500).send("Error fetching events");
        }
    };

    static create = async (req: Request, res: Response) => {
        const { title, description, eventTimestamp, location } = req.body;
        const event = new Event();
        event.title = title;
        event.description = description;
        event.eventTimestamp = new Date(eventTimestamp);
        event.location = location;

        // Optional: createdBy from token
        // const userId = res.locals.jwtPayload.userId;
        // event.createdBy = userId;

        const eventRepository = AppDataSource.getRepository(Event);
        try {
            await eventRepository.save(event);

            try { getIO().emit("events:updated"); } catch (e) { }

            res.status(201).send("Event created");
        } catch (error) {
            res.status(500).send("Error creating event");
        }
    };

    static update = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { title, description, eventTimestamp, location } = req.body;

        const eventRepository = AppDataSource.getRepository(Event);
        let event;
        try {
            event = await eventRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            res.status(404).send("Event not found");
            return;
        }

        event.title = title;
        event.description = description;
        event.eventTimestamp = new Date(eventTimestamp);
        event.location = location;

        try {
            await eventRepository.save(event);

            try { getIO().emit("events:updated"); } catch (e) { }

            res.status(204).send();
        } catch (e) {
            res.status(500).send("Error updating event");
        }
    };

    static delete = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const eventRepository = AppDataSource.getRepository(Event);
        try {
            await eventRepository.delete(id);

            try { getIO().emit("events:updated"); } catch (e) { }

            res.status(204).send();
        } catch (e) {
            res.status(500).send("Error deleting event");
        }
    };
}

export default EventController;
