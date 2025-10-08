"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="relative z-10 border-t border-electric-cyan/10 bg-void/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-quantized-silver/50">
              © 2025 GridMind AI. All rights reserved.
            </p>
            <p className="text-xs text-electric-cyan/40 mt-1 font-mono">
              Powered by GridMind AI
            </p>
          </div>
          
          <div className="flex gap-6 text-xs text-quantized-silver/50">
            <a
              href="#"
              className="hover:text-electric-cyan transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-electric-cyan transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-electric-cyan transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}