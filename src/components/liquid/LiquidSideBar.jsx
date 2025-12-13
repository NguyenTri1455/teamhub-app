import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * LiquidSideBar
 * A desktop sidebar with liquid glass aesthetics.
 * 
 * Aesthetics:
 * - Container: Floating glass panel (rounded right edge or floating island).
 * - Items: Morphing fluid background for active state.
 */
export const LiquidSideBar = ({
    items = [],
    className,
    header,
    footer
}) => {
    return (
        <aside className={cn("hidden md:flex flex-col w-64 h-screen py-4 pl-4 pr-2 sticky top-0 z-20", className)}>
            {/* Glass Container */}
            <div className="flex-1 flex flex-col bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden relative">

                {/* Decorative Liquid Blobs inside the sidebar */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 blur-3xl -z-10 rounded-full animate-blob" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl -z-10 rounded-full animate-blob animation-delay-2000" />

                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    {header}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {items.map((item) => (
                        <SideBarItem key={item.to} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                    {footer}
                </div>
            </div>
        </aside>
    );
};

const SideBarItem = ({ item }) => {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            className="relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group overflow-hidden"
        >
            {({ isActive }) => (
                <>
                    {/* Active Liquid Background */}
                    {isActive && (
                        <motion.div
                            layoutId="active-sidebar-item"
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}

                    {/* Hover Glass Effect (only when not active) */}
                    {!isActive && (
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl" />
                    )}

                    {/* Icon & Label */}
                    <div className="relative z-10 flex items-center space-x-3">
                        <Icon
                            className={cn(
                                "w-5 h-5 transition-colors duration-300",
                                isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                            )}
                        />
                        <span className={cn(
                            "font-medium transition-colors duration-300",
                            isActive ? "text-white" : "text-slate-600 dark:text-slate-300 group-hover:text-foreground"
                        )}>
                            {item.label}
                        </span>
                    </div>

                    {/* Active Shine Effect */}
                    {isActive && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%]"
                            animate={{ translateX: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};
