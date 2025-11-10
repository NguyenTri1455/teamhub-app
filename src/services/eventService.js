// src/services/eventService.js
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,          
  updateDoc,    
  deleteDoc
} from "firebase/firestore";

const eventsCollectionRef = collection(db, "team_events");

// Hàm "nghe" (stream) các sự kiện (sự kiện trong tương lai)
export const streamEvents = (callback) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Lấy thời điểm đầu ngày hôm nay

  const q = query(
    eventsCollectionRef,
    where("eventTimestamp", ">=", Timestamp.fromDate(today)), // Chỉ lấy sự kiện từ hôm nay
    orderBy("eventTimestamp", "asc") // Sắp xếp cái mới nhất lên
  );

  // onSnapshot trả về 1 hàm "hủy" (unsubscribe)
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    callback(events); // Gửi mảng events ra ngoài
  });

  return unsubscribe;
};

// Hàm thêm sự kiện mới
export const addEvent = async (eventData) => {
  try {
    const newEvent = {
      ...eventData,
      // eventTimestamp (đã được xử lý ở form)
      createdAt: Timestamp.now(),
    };
    await addDoc(eventsCollectionRef, newEvent);
  } catch (error) {
    console.error("Lỗi khi thêm sự kiện:", error);
    throw error;
  }
};
export const updateEvent = async (eventId, updatedData) => {
  try {
    const eventDoc = doc(db, "team_events", eventId);
    await updateDoc(eventDoc, updatedData);
  } catch (error) {
    console.error("Lỗi khi cập nhật sự kiện:", error);
    throw error;
  }
};

// Hàm XÓA (DELETE) sự kiện
export const deleteEvent = async (eventId) => {
  try {
    const eventDoc = doc(db, "team_events", eventId);
    await deleteDoc(eventDoc);
  } catch (error){
    console.error("Lỗi khi xóa sự kiện:", error);
    throw error;
  }
};