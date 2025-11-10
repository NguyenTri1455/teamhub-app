// src/services/fundService.js
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  query,
  addDoc,
  Timestamp,
  doc,
  runTransaction,
  orderBy,       
  limit,         
  getDoc,          
  setDoc,
  writeBatch,
  where
} from "firebase/firestore";

const transactionCollectionRef = collection(db, "fund_transactions");
const fundSummaryDocRef = doc(db, "team_meta", "fund_summary"); // Tham chiếu đến doc "chốt"

// Lấy thông tin quỹ (chỉ 1 doc)
export const getFundSummary = async () => {
  const docSnap = await getDoc(fundSummaryDocRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // Nếu doc không tồn tại (lần chạy đầu tiên), tạo nó
    await setDoc(fundSummaryDocRef, { currentBalance: 0 });
    return { currentBalance: 0 };
  }
};

// Lấy các giao dịch (sắp xếp mới nhất lên trên)
export const getTransactions = async () => {
  const q = query(transactionCollectionRef, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addTransaction = async (transactionData) => {

  try {
    const newTransaction = await runTransaction(db, async (transaction) => {
      const fundSummarySnap = await transaction.get(fundSummaryDocRef);
      if (!fundSummarySnap.exists()) {
        throw "Lỗi: Không tìm thấy document fund_summary!";
      }
      
      const currentBalance = fundSummarySnap.data().currentBalance;

      const amount = Number(transactionData.amount);
      const newBalance =
        transactionData.type === "thu"
          ? currentBalance + amount
          : currentBalance - amount;

      // Dùng timestamp từ form
      const newTransactionRef = doc(collection(db, "fund_transactions"));
      const transactionDoc = {
        ...transactionData,       // Đã chứa type, amount, description, timestamp
        amount: amount,
        balanceAfter: newBalance, // Vẫn lưu lại số dư lũy kế
      };
      transaction.set(newTransactionRef, transactionDoc);

      transaction.update(fundSummaryDocRef, { currentBalance: newBalance });

      // Trả về doc đầy đủ (để cập nhật UI)
      return { id: newTransactionRef.id, ...transactionDoc };
    });

    return newTransaction;
  
  } catch (error) {
    console.error("Transaction failed: ", error);
    throw error;
  }
};

export const deleteTransaction = async (txToDelete) => {
  const transactionCollectionRef = collection(db, "fund_transactions");
  const summaryRef = doc(db, "team_meta", "fund_summary");
  const txDocRef = doc(db, "fund_transactions", txToDelete.id);

  const adjustment = txToDelete.type === "thu" ? -txToDelete.amount : txToDelete.amount;

  try {
    const q = query(
      transactionCollectionRef,
      where("timestamp", ">", txToDelete.timestamp), // Chỉ lấy các giao dịch sau
      orderBy("timestamp", "asc") // Sắp xếp từ cũ đến mới
    );
    const subsequentDocs = await getDocs(q);

    const batch = writeBatch(db);

    subsequentDocs.forEach((doc) => {
      const newBalance = doc.data().balanceAfter + adjustment;
      batch.update(doc.ref, { balanceAfter: newBalance });
    });

    const summaryDoc = await getDoc(summaryRef); // Lấy giá trị hiện tại
    const newSummaryBalance = summaryDoc.data().currentBalance + adjustment;
    batch.update(summaryRef, { currentBalance: newSummaryBalance });

    batch.delete(txDocRef);

    await batch.commit();

  } catch (error) {
    console.error("Lỗi khi xóa và tính toán lại:", error);
    throw error;
  }
};