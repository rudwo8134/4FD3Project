"use client";

import { LandingHeader } from "@/components/landing-header";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Github, Linkedin, User } from "lucide-react";

export default function AboutPage() {
  const developers = [
    {
      name: "Kyoungjae Shin",
      id: "400428169",
      role: "Full Stack Developer",
      description: "Passionate about building scalable web applications and AI integration.",
      color: "bg-blue-500"
    },
    {
      name: "Ilyaas Mohamed",
      id: "400562731",
      role: "Frontend Developer",
      description: "Specializes in creating intuitive and responsive user interfaces.",
      color: "bg-green-500"
    },
    {
      name: "Arnold Aran",
      id: "000946051",
      role: "Backend Developer",
      description: "Focuses on system architecture and database management.",
      color: "bg-purple-500"
    },
    {
      name: "Zhang Junjie",
      id: "001429742",
      role: "AI Engineer",
      description: "Expert in machine learning algorithms and data processing.",
      color: "bg-orange-500"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Meet the Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proudly developed for the McMaster 4FD3 Project.
            </p>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {developers.map((dev, index) => (
              <motion.div variants={item} key={index}>
                <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 bg-gradient-to-br from-card to-primary/5 group overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full ${dev.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                        <span className="text-xl font-bold">{dev.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {dev.name}
                        </h3>
                        <p className="text-sm font-medium text-primary mb-1">
                          Student ID: {dev.id}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {dev.role}
                        </p>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                          {dev.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="py-12 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 McMaster 4FD3 Project. Built for future innovators.
          </p>
        </div>
      </footer>
    </div>
  );
}

