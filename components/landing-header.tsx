"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function LandingHeader() {
  const pathname = usePathname();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Briefcase className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              LinkedIn Resume Apply Automation
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/features"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/features" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/how-it-works" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              How it Works
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/about" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              About Developers
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

