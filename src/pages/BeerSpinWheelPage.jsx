// src/pages/BeerSpinWheelPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Dùng để điều hướng
import { BeerSpinWheel } from "@/features/utilities/BeerSpinWheel";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
// Animation
const pageAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function BeerSpinWheelPage() {
  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      {/* Nút Quay Lại */}
      <Button asChild variant="outline" className="mb-4">
        <Link to="/utilities">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Link>
      </Button>
      
      {/* Component Vòng quay */}
      <BeerSpinWheel />
    </motion.div>
  );
}