import api from "@/services/api";
import { getUsers } from "@/services/userService";

export const getRotationData = async () => {
    const res = await api.get("/duty");
    return res.data;
};

export const completeDutyTurn = async () => {
    const res = await api.post("/duty/complete");
    return res.data.currentIndex;
};

export const updateRotationConfig = async (newMemberOrder: number[]) => {
    await api.post("/duty/config", { memberOrder: newMemberOrder });
};

export const getConfigData = async () => {
    const [allMembers, rotationData] = await Promise.all([
        getUsers(),
        getRotationData(),
    ]);
    return { allMembers, rotationData };
};
