// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Lấy thông tin cấu hình từ biến môi trường .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBEASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBEASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBEASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBEASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBEASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBEASE_APP_ID,
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo và export các dịch vụ bạn cần
// Chúng ta sẽ dùng các biến này trong toàn bộ dự án
export const db = getFirestore(app);
export const auth = getAuth(app); // Dùng cho đăng nhập (nếu cần)
export default app;