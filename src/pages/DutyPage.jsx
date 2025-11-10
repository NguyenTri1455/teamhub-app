import { DutyRotation } from "@/features/duty/DutyRotation";
import { Link } from "react-router-dom"; 
import { Button } from "@/components/ui/button"; 
import { ChevronLeft } from "lucide-react"; 
import { motion } from "framer-motion";
const pageAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
export function DutyPage() {
  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <Button asChild variant="outline" className="mb-4">
        <Link to="/utilities">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Link>
      </Button>
      <DutyRotation />
    </motion.div>
  );
}