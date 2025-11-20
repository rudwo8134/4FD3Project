"use client";

import { LandingHeader } from "@/components/landing-header";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Search, Send, FileText, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Upload,
      title: "Drop Your Resume",
      description: "Simply upload your PDF or Word resume. We'll extract your skills, experience, and education to build your digital profile instantly.",
      color: "bg-blue-500"
    },
    {
      icon: Search,
      title: "We Find the Matches",
      description: "Our system scans thousands of listings to find jobs that actually fit your profile. Filter by what matters to you—location, title, and more.",
      color: "bg-indigo-500"
    },
    {
      icon: Sparkles,
      title: "Tailored for Success",
      description: "For every job you pick, our AI analyzes the requirements and tweaks your application to highlight why you're the perfect fit.",
      color: "bg-purple-500"
    },
    {
      icon: Send,
      title: "One-Click Apply",
      description: "Sit back as our system navigates the application forms for you. It fills in the details, uploads your custom documents, and hits submit.",
      color: "bg-pink-500"
    },
    {
      icon: CheckCircle,
      title: "Stay in the Loop",
      description: "Keep tabs on all your applications in one easy dashboard. Track your status and see your success rate climb.",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Your Path to a New Job
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From search to submission, we make the journey simple.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 w-full md:w-1/2">
                    <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 group">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className={`w-12 h-12 rounded-lg ${step.color} bg-opacity-10 flex items-center justify-center text-white md:hidden self-start`}>
                            <step.icon className={`h-6 w-6 ${step.color.replace('bg-', 'text-')}`} />
                          </div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {index + 1}. {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative flex items-center justify-center w-14 md:w-auto z-10">
                    <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center shadow-lg shadow-primary/20`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 w-full md:w-1/2 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
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

