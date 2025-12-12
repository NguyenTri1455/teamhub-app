import api from "@/services/api";

export interface BeerPartyParticipant {
    memberId: number;
    name: string;
    avatar: string;
    count: number;
}

export interface BeerParty {
    id: number;
    status: string;
    createdAt: string;
    totalCount: number;
    participants: BeerPartyParticipant[];
}

export const createBeerParty = async (selectedMembers: any[]) => {
    // Backend expects array of { id, name, avatar }
    const res = await api.post("/beer-parties", { selectedMembers });
    return res.data.id;
};

export const findActiveParty = async () => {
    const res = await api.get("/beer-parties/active");
    return res.data ? res.data.id : null;
};

export const streamParty = (partyId: number | string, callback: (party: BeerParty | null) => void) => {
    // If partyId is provided, current API logic assumes getting active one, 
    // but better to have getById. 
    // However, for now, let's poll "active" or just use one endpoint if only one active party allowed.
    // The previous logic used ID but we just implemented getActive in controller.

    // Simplification: Poll getActive. If ID matches or just return active.

    const fetch = async () => {
        try {
            const res = await api.get("/beer-parties/active");
            if (res.data) {
                callback(res.data);
            } else {
                callback(null);
            }
        } catch (e) {
            callback(null);
        }
    };

    fetch();
    const interval = setInterval(fetch, 3000); // Fast polling for party
    return () => clearInterval(interval);
};

export const updateCount = async (partyId: number | string, memberId: number, newCount: number) => {
    await api.post("/beer-parties/count", { partyId, memberId, newCount });
};

export const endBeerParty = async (partyId: number | string) => {
    await api.post(`/beer-parties/${partyId}/end`);
};
