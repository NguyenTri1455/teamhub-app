// src/services/memberService.js
import { db } from "@/config/firebase"; // Import db từ tệp config
import { collection, getDocs, query, addDoc, Timestamp, doc, deleteDoc, updateDoc, getDoc, runTransaction } from "firebase/firestore";

const membersCollectionRef = collection(db, "members");

// Hàm lấy TẤT CẢ thành viên
export const getMembers = async () => {
  try {
    const q = query(membersCollectionRef);
    const querySnapshot = await getDocs(q);

    const members = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error; // Ném lỗi ra để component xử lý
  }
};
export const addMember = async (memberData) => {
  try {
    // Thêm trường joinDate (ngày tham gia)
    const newMember = {
      ...memberData,
      joinDate: Timestamp.now(), // Tự động thêm ngày giờ hiện tại
    };
    const docRef = await addDoc(membersCollectionRef, newMember);
    return { id: docRef.id, ...newMember }; // Trả về thành viên mới với ID
  } catch (error) {
    console.error("Error adding member:", error);
    throw error;
  }
};
// HÀM MỚI (ĐÃ SỬA)
export const deleteMember = async (memberId) => {
  // 1. Định nghĩa các tham chiếu (references)
  const memberDocRef = doc(db, "members", memberId);
  const dutyRotationRef = doc(db, "team_meta", "duty_rotation");

  try {
    // 2. Chạy Transaction
    await runTransaction(db, async (transaction) => {
      // 3. Đọc (GET) tài liệu xoay tua TRƯỚC
      const dutySnap = await transaction.get(dutyRotationRef);

      // 4. Kiểm tra và Cập nhật (UPDATE) mảng xoay tua
      if (dutySnap.exists()) {
        const dutyData = dutySnap.data();
        const currentOrder = dutyData.memberOrder || [];

        // Lọc bỏ ID của member bị xóa
        const newMemberOrder = currentOrder.filter(id => id !== memberId);
        
        // Cập nhật lại tài liệu xoay tua
        transaction.update(dutyRotationRef, { memberOrder: newMemberOrder });
      }

      // 5. Xóa (DELETE) member
      // (Điều này chỉ xảy ra nếu bước 4 thành công)
      transaction.delete(memberDocRef);
    });

    // Nếu mọi thứ thành công, transaction sẽ commit
    console.log("Đã xóa thành viên và cập nhật danh sách xoay tua!");

  } catch (error) {
    console.error("Giao dịch xóa thành viên thất bại:", error);
    throw error;
  }
};
export const updateMember = async (id, updatedData) => {
  try {
    const memberDoc = doc(db, "members", id);
    await updateDoc(memberDoc, updatedData);
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
};