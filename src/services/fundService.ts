import api from "@/services/api";

export interface FundTransaction {
    id: number;
    type: 'thu' | 'chi';
    amount: number;
    description: string;
    timestamp: string; // ISO
    balanceAfter: number;
}

export const getFundSummary = async () => {
    const res = await api.get("/funds/summary");
    // Ensure we mimic the old format { currentBalance: X }
    return res.data;
};

export const getTransactions = async () => {
    const res = await api.get("/funds");
    return res.data;
};

export const addTransaction = async (transactionData: Partial<FundTransaction>) => {
    const res = await api.post("/funds", transactionData);
    return res.data;
};

export const deleteTransaction = async (txToDelete: FundTransaction) => {
    await api.delete(`/funds/${txToDelete.id}`);
};
