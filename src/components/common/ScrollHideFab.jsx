import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ScrollHideFab
 * A Floating Action Button that hides when scrolling down and shows when scrolling up.
 * 
 * Props:
 * - onClick: Function to trigger when clicked.
 * - icon: Icon component (default: Plus).
 * - label: Optional label (tooltip or text).
 */
export const ScrollHideFab = React.forwardRef(({ onClick, icon: Icon = Plus, className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if scrolling up or at the very top
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Hide if scrolling down and not at top
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    ref={ref}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClick}
                    className={cn(
                        "fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50", // Adjustable position (above nav on mobile)
                        "flex items-center justify-center w-14 h-14 rounded-full",
                        "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/40",
                        "text-white backdrop-blur-md border border-white/20",
                        className
                    )}
                    {...props}
                >
                    {/* Liquid Shine Effect */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50" />
                    </div>

                    <Icon className="w-6 h-6" />
                </motion.button>
            )}
        </AnimatePresence>
    );
});

ScrollHideFab.displayName = "ScrollHideFab";
