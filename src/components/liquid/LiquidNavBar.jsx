import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * LiquidNavBar
 * A floating "dock" style navigation with morphing active state.
 * 
 * Aesthetics:
 * - Container: Pill-shaped, high blur glass, translucent.
 * - Active State: "Bubble" of liquid gradient that Slides (morphs) to the new item.
 * - Items: Icons that scale up on hover/active.
 */
export const LiquidNavBar = ({ items = [] }) => {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="flex items-center gap-1 p-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl">
                {items.map((item) => (
                    <NavItem key={item.to} item={item} />
                ))}
            </nav>
        </div>
    );
};

const NavItem = ({ item }) => {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-colors"
        >
            {({ isActive }) => (
                <>
                    {/* Active Liquid Bubble */}
                    {isActive && (
                        <motion.div
                            layoutId="liquid-nav-bubble"
                            className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                    )}

                    {/* Icon */}
                    <div className="relative z-10">
                        <Icon
                            className={cn(
                                "w-6 h-6 transition-colors duration-300",
                                isActive ? "text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                            )}
                        />
                    </div>
                </>
            )}
        </NavLink>
    );
};
