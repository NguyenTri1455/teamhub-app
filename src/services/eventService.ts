import api from "@/services/api";

export interface Event {
    id: number;
    title: string;
    description: string;
    eventTimestamp: string | Date; // API returns string (ISO), we might need to process it
    location: string;
    createdBy: string;
    createdAt: string;
}

// Simulate real-time stream with polling
// Basic fetch function
export const getEvents = async () => {
    try {
        const res = await api.get("/events");
        // Convert timestamp strings to Date objects
        return res.data.map((e: any) => ({
            ...e,
            eventTimestamp: new Date(e.eventTimestamp),
            createdAt: new Date(e.createdAt)
        }));
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

// Deprecated: streamEvents was simulate with polling, now we use Socket in Component
export const streamEvents = (callback: (events: Event[]) => void) => {
    getEvents().then(callback);
    // No polling here anymore, component handles socket
    return () => { };
};

export const addEvent = async (eventData: Partial<Event>) => {
    await api.post("/events", eventData);
};

export const updateEvent = async (eventId: number, updatedData: Partial<Event>) => {
    await api.put(`/events/${eventId}`, updatedData);
};

export const deleteEvent = async (eventId: number) => {
    await api.delete(`/events/${eventId}`);
};
