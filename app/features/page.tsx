"use client";

import { LandingHeader } from "@/components/landing-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Search, CheckCircle, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesPage() {
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
              What We Do For You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to land your dream job, without the burnout.
            </p>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <CardTitle>We Read Your Resume Like a Human</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our system understands your skills and experience just like a recruiter would, extracting the details that actually matter.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Search className="h-6 w-6" />
                  </div>
                  <CardTitle>Smarter Job Hunt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We don't just search keywords. We find roles that fit your career path, filtering out the noise so you see only the good stuff.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <CardTitle>One-Click Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Skip the repetitive forms. Apply to multiple companies in a single click and let us handle the boring data entry.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <CardTitle>Tailored Just for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We customize your application for each job, tweaking keywords and generating cover letters that speak directly to the hiring manager.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <CardTitle>Know Your Odds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stop guessing. Our suitability score tells you exactly how well you match a job description before you even apply.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <CardTitle>Reclaim Your Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Save hours every week. Go for a walk, learn a new skill, or just relax while we keep your job search moving forward.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
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

