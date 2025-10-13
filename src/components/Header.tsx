"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Activity } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { name: "Overview", path: "/" },
    { name: "Data Ingestion", path: "/data-ingestion" },
    { name: "Diagnostics", path: "/diagnostics" },
    { name: "Grid Command", path: "/grid-command" },
    { name: "Training", path: "/training" },
    { name: "Technology", path: "/technology" },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-electric-cyan/20"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Activity className="w-8 h-8 text-electric-cyan group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 blur-lg bg-electric-cyan/30 group-hover:bg-electric-cyan/50 transition-all duration-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-electric-cyan text-glow-cyan font-sans">
                GridMind
              </h1>
              <p className="text-[10px] text-quantized-silver/60 tracking-widest uppercase">
                AURA Initiative
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-6 py-2 text-sm font-medium transition-colors duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-electric-cyan/10 border border-electric-cyan/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive
                        ? "text-electric-cyan"
                        : "text-quantized-silver/70 hover:text-electric-cyan"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}