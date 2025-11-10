import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { ArrowRight } from "lucide-react"; // <-- KHÔNG DÙNG ICON NÀY NỮA

// --- DANH SÁCH LỰA CHỌN ---
const wheelSlices = [
  { label: "Uống 1/2 ly" },
  { label: "Bên trái uống" },
  { label: "Thoát nạn (khỏi uống)" },
  { label: "Bên phải uống" },
  { label: "Chỉ ai đó uống" },
  { label: "Quay lại" },
  { label: "Được ăn mồi" },
  { label: "Uống 2 ly" },
  { label: "Tất cả cùng uống" },
  { label: "Tìm người uống cùng" },
  { label: "Uống 1 ly" },
];

// Màu sắc cho các lát cắt (sẽ tự lặp lại)
const sliceColors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45A5FF", "#F0A500", "#7A40A0", "#FF8C00", "#32CD32"];

// Tính toán góc
const sliceAngle = 360 / wheelSlices.length;

export function BeerSpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  // --- Tạo style background conic-gradient ---
  const gradientString = wheelSlices
    .map((_, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;
      const color = sliceColors[index % sliceColors.length];
      return `${color} ${startAngle}deg ${endAngle}deg`;
    })
    .join(", ");

  const wheelStyle = {
    background: `conic-gradient(${gradientString})`,
  };

  // --- Logic khi nhấn nút Quay ---
  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const targetIndex = Math.floor(Math.random() * wheelSlices.length);
    const targetSlice = wheelSlices[targetIndex];

    // 🚀 ĐIỀU CHỈNH LẠI CÁCH TÍNH GÓC CUỐI CÙNG 🚀
    // Mũi tên giờ chỉ vào 0 độ (hướng 3 giờ).
    // Chúng ta cần lát cắt "targetIndex" xoay đến vị trí đó.
    // Lát cắt đầu tiên (index 0) nằm từ 0 đến sliceAngle. Trung tâm là sliceAngle / 2.
    // Lát cắt targetIndex có trung tâm tại (targetIndex * sliceAngle) + (sliceAngle / 2).
    // Để lát cắt đó trỏ vào 0 độ (mũi tên), chúng ta cần xoay bánh xe ngược lại lượng đó.
    
    // Góc giữa của lát cắt mà chúng ta muốn dừng lại
    const centerOfTargetSlice = (targetIndex * sliceAngle) + (sliceAngle / 2);
    
    // Thêm một số vòng quay ngẫu nhiên lớn
    const randomFullSpins = (5 + Math.floor(Math.random() * 5)) * 360;
    
    // Góc quay cuối cùng cần để centerOfTargetSlice dừng ở vị trí 0 độ (mũi tên)
    // (rotation + X) % 360 = 0 - centerOfTargetSlice
    // 0 - centerOfTargetSlice sẽ âm, nên chúng ta cộng thêm 360 để nó dương
    const angleToLandAtZero = (360 - centerOfTargetSlice) % 360;

    // Tổng số độ quay
    const finalRotation = rotation + randomFullSpins + angleToLandAtZero;
    // Đảm bảo không quay ngược lại mà luôn tiến lên, và giữ cảm giác "xoay"
    // Nếu newRotation < currentRotation, thêm 360 độ nữa
    // if (finalRotation < rotation) {
    //   finalRotation += 360; // Đảm bảo nó luôn quay tiến
    // }


    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(targetSlice.label);
    }, 5000); 
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-6">Vòng quay Uống bia</h2>
      
      {/* Container của Vòng quay */}
      <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {/* Mũi tên trỏ xuống */}
          <div className="w-0 h-0 
            border-l-[20px] border-l-transparent
            border-r-[20px] border-r-transparent
            border-t-[30px] border-t-foreground
            md:border-l-[30px] md:border-r-[30px] md:border-t-[45px]" 
          />
        </div>
        
        {/* Vòng quay (Sẽ bị xoay) */}
        <motion.div
          className="w-full h-full rounded-full border-2 border-foreground shadow-xl overflow-hidden"
          style={wheelStyle}
          animate={{ rotate: rotation }}
          transition={{
            type: "tween",
            duration: 5,
            ease: "easeOut",
          }}
        >
          {/* Thêm chữ vào vòng quay */}
          {wheelSlices.map((slice, index) => {
            const angle = sliceAngle * index + sliceAngle / 2; // Góc giữa lát cắt
            return (
              <div
                key={index}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${angle}deg)`, // Xoay container của chữ
                }}
              >
                <span 
                  className="absolute top-[10%] left-1/2 -translate-x-1/2 
                             w-max max-w-[40%] text-center font-bold text-black 
                             text-xs md:text-sm px-1"
                >
                  {slice.label}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Nút Quay (ở giữa) */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className="absolute h-20 w-20 md:h-24 md:w-24 rounded-full text-xl font-bold z-10"
          variant="secondary"
        >
          {isSpinning ? "..." : "QUAY"}
        </Button>
      </div>

      {/* Dialog Hiển thị Kết quả */}
      <AlertDialog open={!!result} onOpenChange={() => setResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              Kết quả:
            </AlertDialogTitle>
            <p className="text-3xl font-bold text-center text-primary py-4">
              {result}
            </p>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setResult(null)}>
            Đã hiểu!
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}