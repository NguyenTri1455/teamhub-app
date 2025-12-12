import api from "@/services/api";

export interface Invitation {
    email: string;
    invitedBy: string;
    invitedAt: string;
    status: string;
}

export const streamInvitations = (callback: (invites: Invitation[]) => void) => {
    const fetch = async () => {
        try {
            const res = await api.get("/invitations");
            callback(res.data);
        } catch (error) {
            console.error("Error fetching invitations", error);
        }
    };

    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
};

export const addInvitation = async (email: string) => {
    // invitedBy matches auth user in backend
    await api.post("/invitations", { email });
};

export const deleteInvitation = async (email: string) => {
    await api.delete(`/invitations/${email}`);
};
