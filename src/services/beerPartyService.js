// src/services/beerPartyService.js
import { db } from "@/config/firebase";
import { collection, addDoc, Timestamp, doc, onSnapshot,  runTransaction, where, query, limit, getDocs, updateDoc } from "firebase/firestore";
const partyCollectionRef = collection(db, "beer_parties");

// Hàm tạo một "bữa tiệc" mới
export const createBeerParty = async (selectedMembers) => {
  // Biến đổi mảng member_objects thành mảng participants
  const participants = selectedMembers.map(member => ({
    memberId: member.id,
    name: member.name,
    avatar: member.avatar,
    count: 0, // Bắt đầu với 0
  }));

  try {
    const partyDoc = {
      createdAt: Timestamp.now(),
      status: "active", // Trạng thái "đang diễn ra"
      totalCount: 0,
      participants: participants, // Danh sách người tham gia
    };

    const docRef = await addDoc(partyCollectionRef, partyDoc);
    return docRef.id; // Trả về ID của bữa tiệc mới
  } catch (error) {
    console.error("Lỗi khi tạo bữa tiệc:", error);
    throw error;
  }
};
export const streamParty = (partyId, callback) => {
  const partyDocRef = doc(db, "beer_parties", partyId);
  
  // onSnapshot tự động gửi dữ liệu mới khi có thay đổi
  const unsubscribe = onSnapshot(partyDocRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null); // Không tìm thấy tiệc
    }
  });

  return unsubscribe; // Trả về hàm "hủy đăng ký"
};

export const updateCount = async (partyId, memberId, newCount) => {
  if (newCount < 0) newCount = 0; // Không cho phép số âm

  const partyDocRef = doc(db, "beer_parties", partyId);

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Đọc dữ liệu (bên trong transaction)
      const partyDoc = await transaction.get(partyDocRef);
      if (!partyDoc.exists()) {
        throw "Không tìm thấy bữa tiệc!";
      }

      const partyData = partyDoc.data();
      let newTotalCount = 0;

      // 2. Cập nhật mảng participants (logic trong code)
      const updatedParticipants = partyData.participants.map(p => {
        let finalCount = p.count;
        if (p.memberId === memberId) {
          finalCount = newCount;
        }
        newTotalCount += finalCount; // Tính lại tổng
        return { ...p, count: finalCount };
      });

      // 3. Ghi lại dữ liệu (bên trong transaction)
      transaction.update(partyDocRef, {
        participants: updatedParticipants,
        totalCount: newTotalCount
      });
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật số đếm:", error);
    throw error;
  }
};
export const findActiveParty = async () => {
  const q = query(
    partyCollectionRef,
    where("status", "==", "active"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null; // Không tìm thấy tiệc
  }
  
  // Trả về ID của bữa tiệc đang active
  return querySnapshot.docs[0].id; 
};

// HÀM MỚI: Kết thúc một bữa tiệc
export const endBeerParty = async (partyId) => {
  const partyDocRef = doc(db, "beer_parties", partyId);
  try {
    await updateDoc(partyDocRef, {
      status: "finished", // Chuyển trạng thái
      endedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Lỗi khi kết thúc tiệc:", error);
    throw error;
  }
};