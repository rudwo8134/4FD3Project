"use client";
import { useState } from "react";
import { LandingHeader } from "@/components/landing-header";
import { motion, AnimatePresence } from "framer-motion";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Search,
  Briefcase,
  CheckCircle,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  X,
  User,
  Mail,
  Phone,
  LocateOffIcon as LocationIcon,
  Award,
  WormIcon as WorkIcon,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PAGE_SIZE = 25;
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showResumeInfo, setShowResumeInfo] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [currentApplicationStep, setCurrentApplicationStep] = useState("");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [applicationProgress, setApplicationProgress] = useState<{
    [key: string]: string;
  }>({});
  const [showApplicationResults, setShowApplicationResults] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to parse resume: ${res.status} ${res.statusText} - ${errorText}`
        );
      }

      const data = await res.json();
      setResumeData(data);
      setUploadedResume(file);
      setShowResumeInfo(true);
    } catch (error) {
      alert("Failed to parse resume. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeResume = () => {
    setUploadedResume(null);
    setShowResumeInfo(false);
  };

  const handleStartDiscovery = async () => {
    if (!uploadedResume) {
      alert("Please upload your resume first");
      return;
    }
    if (!jobTitle.trim()) {
      alert("Please enter a job title");
      return;
    }
    if (!location.trim()) {
      alert("Please enter a location");
      return;
    }

    try {
      setIsSearching(true);
      const params = new URLSearchParams({
        q: jobTitle,
        location,
        limit: String(PAGE_SIZE),
        offset: "0",
        isEmailAvailable: "true",
      });
      const res = await fetch(`/api/jobs/search?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }
      const data = await res.json();
      const mapped = Array.isArray(data?.results)
        ? data.results.map((r: any) => ({
            id: r.id ?? r.job_posting_id ?? crypto.randomUUID(),
            jobPostingId: r.job_posting_id ?? null,
            title: r.job_title ?? "",
            company: r.company_name ?? "",
            companyId: r.company_id ?? null,
            companyUrl: r.company_url ?? null,
            location: r.job_location ?? location,
            employmentType: r.job_employment_type ?? "",
            seniorityLevel: r.job_seniority_level ?? "",
            jobFunction: r.job_function ?? null,
            jobIndustries: r.job_industries ?? null,
            posted: r.job_posted_time ?? "",
            postedDate: r.job_posted_date ?? null,
            daysSincePosted: r.days_since_posted ?? null,
            description: r.job_summary ?? "",
            url: r.url ?? "#",
            score: r.suitabilityScore ?? 0,
            suitabilityScore: r.suitabilityScore ?? 0,
            keyPoints: r.keyPoints ?? r.key_points ?? null,
            isEmailAvailable: r.isEmailAvailable ?? false,
            resumeEmail: r.resume_email ?? null,
          }))
        : [];
      setJobs(mapped);
      setShowJobs(true);
      setOffset(mapped.length);
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (e: any) {
      alert(e?.message ?? "Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  // Deprecated mock data; using live `jobs` from API instead
  const mockJobs: never[] = [];

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const params = new URLSearchParams({
        q: jobTitle,
        location,
        limit: String(PAGE_SIZE),
        offset: String(offset),
        isEmailAvailable: "true",
      });
      const res = await fetch(`/api/jobs/search?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      const mapped = Array.isArray(data?.results)
        ? data.results.map((r: any) => ({
            id: r.id ?? r.job_posting_id ?? crypto.randomUUID(),
            jobPostingId: r.job_posting_id ?? null,
            title: r.job_title ?? "",
            company: r.company_name ?? "",
            companyId: r.company_id ?? null,
            companyUrl: r.company_url ?? null,
            location: r.job_location ?? location,
            employmentType: r.job_employment_type ?? "",
            seniorityLevel: r.job_seniority_level ?? "",
            jobFunction: r.job_function ?? null,
            jobIndustries: r.job_industries ?? null,
            posted: r.job_posted_time ?? "",
            postedDate: r.job_posted_date ?? null,
            daysSincePosted: r.days_since_posted ?? null,
            description: r.job_summary ?? "",
            url: r.url ?? "#",
            score: r.suitabilityScore ?? 0,
            suitabilityScore: r.suitabilityScore ?? 0,
            keyPoints: r.keyPoints ?? r.key_points ?? null,
            isEmailAvailable: r.isEmailAvailable ?? false,
            resumeEmail: r.resume_email ?? null,
          }))
        : [];
      setJobs((prev) => [...prev, ...mapped]);
      setOffset((prev) => prev + mapped.length);
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (e: any) {
      alert(e?.message ?? "Load more failed");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleApplyToJobs = async () => {
    if (selectedJobs.length === 0 || !uploadedResume) return;

    setIsApplying(true);
    setApplicationProgress({});
    setCurrentJobIndex(0);
    setShowApplicationResults(false);

    const applicationSteps = [
      "Analyzing job requirements...",
      "Customizing resume for position...",
      "Extracting application email...",
      "Filling application form...",
      "Uploading resume...",
      "Filling experience details...",
      "Sending application...",
    ];

    for (let i = 0; i < selectedJobs.length; i++) {
      const jobId = selectedJobs[i];
      const job = jobs.find((j) => j.id === jobId);
      setCurrentJobIndex(i);

      // Initial step
      setCurrentApplicationStep(`Applying to ${job?.company}: Starting...`);

      if (!job?.isEmailAvailable) {
        // Skip jobs that don't support email application
        // Or handle as failure
        setApplicationProgress((prev) => ({
          ...prev,
          [jobId]: "skipped", // or 'failed'
        }));
        continue;
      }

      try {
        // Simulate steps before actual API call for better UX
        for (
          let stepIndex = 0;
          stepIndex < applicationSteps.length - 1;
          stepIndex++
        ) {
          setCurrentApplicationStep(
            `Applying to ${job?.company}: ${applicationSteps[stepIndex]}`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 800 + Math.random() * 500)
          );
        }

        setCurrentApplicationStep(
          `Applying to ${job?.company}: Sending application...`
        );

        const formData = new FormData();
        formData.append("job_posting_id", job.jobPostingId);
        formData.append("applicant_email", resumeData?.email || "");
        formData.append("applicant_name", resumeData?.name || "");
        formData.append("emailTestMode", "true"); // TODO: Make this configurable?
        formData.append("files", uploadedResume);

        const res = await fetch("/api/jobs/apply", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to apply: ${res.status}`);
        }

        const result = await res.json();

        if (
          result.status === "success" &&
          result.results?.[0]?.status === "success"
        ) {
          setApplicationProgress((prev) => ({
            ...prev,
            [jobId]: "completed",
          }));
        } else {
          throw new Error(result.results?.[0]?.error || "Application failed");
        }
      } catch (error: any) {
        console.error(`Error applying to job ${jobId}:`, error);
        setApplicationProgress((prev) => ({
          ...prev,
          [jobId]: "failed",
        }));
      }

      // Small pause between jobs
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsApplying(false);
    setShowApplicationResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Let&apos;s Get You Hired, Faster.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Drop in your resume, and we&apos;ll handle the heavy lifting. We
              find the right jobs and help you apply in seconds, so you can
              focus on the interview.
            </p>
          </motion.div>

          {/* Resume Upload Section */}
          <div className="max-w-md mx-auto mb-8">
            {!uploadedResume ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 mb-6">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-muted-foreground mb-4">
                  PDF or Word document (max 10MB)
                </p>
                <Button
                  variant="outline"
                  disabled={isUploading}
                  onClick={() =>
                    document.getElementById("resume-upload")?.click()
                  }
                  className="cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="resume-upload"
                />
              </div>
            ) : (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedResume.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedResume.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeResume}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resume Information Display Section */}
          {showResumeInfo && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Extracted Resume Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{resumeData?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{resumeData?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{resumeData?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{resumeData?.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <WorkIcon className="h-4 w-4" />
                      Work Experience
                    </h4>
                    <div className="space-y-3">
                      {resumeData?.experience?.map(
                        (exp: any, index: number) => (
                          <div
                            key={index}
                            className="border-l-2 border-primary/20 pl-4"
                          >
                            <div className="font-medium">{exp.position}</div>
                            <div className="text-sm text-muted-foreground">
                              {exp.company} • {exp.duration}
                            </div>
                            <div className="text-sm mt-1">
                              {exp.description}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData?.skills?.map(
                        (skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="font-semibold mb-2">Education</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {Array.isArray(resumeData?.education) ? (
                        resumeData.education.map((edu: string, i: number) => (
                          <p key={i}>{edu}</p>
                        ))
                      ) : (
                        <p>{resumeData?.education}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Job Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12 relative z-30"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-primary/10 border p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder="Job title, keywords, or company"
                    value={jobTitle}
                    onChange={async (e) => {
                      const v = e.target.value;
                      setJobTitle(v);
                      if (!v.trim()) {
                        setJobSuggestions([]);
                        setShowJobSuggestions(false);
                        return;
                      }
                      // Debounce inline
                      await new Promise((r) => setTimeout(r, 200));
                      const params = new URLSearchParams({ q: v });
                      try {
                        const res = await fetch(
                          `/api/jobs/suggestions?${params.toString()}`,
                          { cache: "no-store" }
                        );
                        if (!res.ok) throw new Error("Failed to fetch jobs");
                        const data = await res.json();
                        const suggestions: string[] = Array.isArray(
                          data?.results
                        )
                          ? data.results
                          : [];
                        setJobSuggestions(suggestions);
                        setShowJobSuggestions(suggestions.length > 0);
                      } catch (err) {
                        setJobSuggestions([]);
                        setShowJobSuggestions(false);
                      }
                    }}
                    onFocus={() =>
                      setShowJobSuggestions(jobSuggestions.length > 0)
                    }
                    onBlur={() =>
                      setTimeout(() => setShowJobSuggestions(false), 200)
                    }
                    className="pl-12 h-14 text-lg border-transparent focus-visible:ring-0 bg-transparent hover:bg-gray-50/50 transition-colors rounded-xl"
                  />

                  {/* Job Suggestions Dropdown */}
                  {showJobSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl overflow-hidden max-h-64 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2">
                        <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                          SUGGESTED JOBS
                        </div>
                        {jobSuggestions.map((s) => (
                          <div
                            key={s}
                            className="px-3 py-3 hover:bg-primary/5 hover:text-primary rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                            onMouseDown={() => {
                              setJobTitle(s);
                              setShowJobSuggestions(false);
                            }}
                          >
                            <Search className="h-4 w-4" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:block w-px bg-gray-200 my-3" />

                <div className="flex-1 relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder="City, province, or region"
                    value={location}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onChange={async (e) => {
                      const v = e.target.value;
                      setLocation(v);
                      if (!v.trim()) {
                        setLocationSuggestions([]);
                        setShowLocationSuggestions(false);
                        return;
                      }
                      // Debounce inline
                      await new Promise((r) => setTimeout(r, 200));
                      const params = new URLSearchParams({ q: v });
                      try {
                        const res = await fetch(
                          `/api/locations/search?${params.toString()}`,
                          { cache: "no-store" }
                        );
                        if (!res.ok)
                          throw new Error("Failed to fetch locations");
                        const data = await res.json();
                        const suggestions: string[] = Array.isArray(
                          data?.results
                        )
                          ? data.results
                          : [];
                        setLocationSuggestions(suggestions);
                        setShowLocationSuggestions(suggestions.length > 0);
                      } catch (err) {
                        setLocationSuggestions([]);
                        setShowLocationSuggestions(false);
                      }
                    }}
                    onFocus={() =>
                      setShowLocationSuggestions(locationSuggestions.length > 0)
                    }
                    onBlur={() =>
                      setTimeout(() => setShowLocationSuggestions(false), 200)
                    }
                    className="pl-12 h-14 text-lg border-transparent focus-visible:ring-0 bg-transparent hover:bg-gray-50/50 transition-colors rounded-xl"
                  />

                  {/* Location Suggestions Dropdown */}
                  {showLocationSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl overflow-hidden max-h-64 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2">
                        <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                          SUGGESTED LOCATIONS
                        </div>
                        {locationSuggestions.map((s) => (
                          <div
                            key={s}
                            className="px-3 py-3 hover:bg-primary/5 hover:text-primary rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                            onMouseDown={() => {
                              setLocation(s);
                              setShowLocationSuggestions(false);
                            }}
                          >
                            <MapPin className="h-4 w-4" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleStartDiscovery}
                  disabled={
                    isSearching ||
                    !jobTitle.trim() ||
                    !uploadedResume ||
                    !location.trim()
                  }
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all rounded-xl"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Searching...
                    </>
                  ) : (
                    "Find Jobs"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Jobs Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">
                Match Accuracy
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5hrs</div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Results Section */}
      {showJobs && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">
                Found {jobs.length} Matching Jobs
              </h3>
              <p className="text-muted-foreground">
                Select the jobs you'd like to apply to
              </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {jobs.map((job, index) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-all ${
                    selectedJobs.includes(job.id)
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:shadow-md"
                  } ${
                    isApplying &&
                    currentJobIndex === selectedJobs.indexOf(job.id) &&
                    selectedJobs.includes(job.id)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 gap-y-2 mb-2">
                          <h4 className="text-xl font-semibold">{job.title}</h4>

                          {typeof job.suitabilityScore === "number" && (
                            <div className="group relative">
                              <span
                                className={`px-2 py-1 rounded-full text-sm font-medium cursor-help flex items-center gap-1 ${
                                  job.suitabilityScore >= 80
                                    ? "bg-green-100 text-green-700"
                                    : job.suitabilityScore >= 60
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                <Sparkles className="h-3 w-3" />
                                AI Score: {Math.round(job.suitabilityScore)}%
                              </span>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                AI-analyzed match with your resume
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          )}

                          {job.isEmailAvailable && (
                            <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              Email Apply
                            </span>
                          )}
                          {isApplying && selectedJobs.includes(job.id) && (
                            <div className="flex items-center gap-2">
                              {applicationProgress[job.id] === "completed" ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Applied
                                  </span>
                                </div>
                              ) : applicationProgress[job.id] === "failed" ? (
                                <div className="flex items-center gap-1 text-red-600">
                                  <X className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Failed
                                  </span>
                                </div>
                              ) : applicationProgress[job.id] === "skipped" ? (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Skipped
                                  </span>
                                </div>
                              ) : currentJobIndex ===
                                selectedJobs.indexOf(job.id) ? (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm font-medium">
                                    Applying...
                                  </span>
                                </div>
                              ) : selectedJobs.indexOf(job.id) <
                                currentJobIndex ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Applied
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Waiting...
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-lg text-muted-foreground mb-2">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                          )}
                          {job.employmentType && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {job.employmentType}
                            </span>
                          )}
                          {job.seniorityLevel && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {job.seniorityLevel}
                            </span>
                          )}
                          {job.jobFunction && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {job.jobFunction}
                            </span>
                          )}
                          {job.jobIndustries && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {job.jobIndustries}
                            </span>
                          )}
                          {(job.daysSincePosted !== null || job.posted) && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.daysSincePosted !== null
                                ? job.daysSincePosted === 0
                                  ? "Today"
                                  : `${job.daysSincePosted} day${
                                      job.daysSincePosted === 1 ? "" : "s"
                                    } ago`
                                : job.posted}
                            </div>
                          )}
                          {job.companyUrl && (
                            <a
                              className="flex items-center gap-1 underline hover:text-foreground"
                              href={job.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Company Site{" "}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>

                        {typeof job.score === "number" && job.score >= 80 && (
                          <div className="mt-3 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-800">
                            <ShieldCheck className="h-4 w-4 mt-0.5" />
                            <div className="text-sm">
                              <div className="font-medium">High Match</div>
                              <div>
                                Suitability Score is {Math.round(job.score)}%.
                                We recommend submitting—your chance of success
                                is higher.
                              </div>
                            </div>
                          </div>
                        )}

                        {job.isEmailAvailable && (
                          <div className="mt-3 flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-800">
                            <Mail className="h-4 w-4 mt-0.5" />
                            <div className="text-sm">
                              <div className="font-medium">
                                Email Application Available
                              </div>
                              <div>
                                You can apply directly via email
                                {job.resumeEmail ? `: ${job.resumeEmail}` : ""}.
                              </div>
                            </div>
                          </div>
                        )}

                        {job.keyPoints && (
                          <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Key Points to Mention in Application
                              <span className="ml-2 text-xs text-muted-foreground">
                                (AI‑analyzed)
                              </span>
                            </div>
                            {(() => {
                              const items = Array.isArray(job.keyPoints)
                                ? job.keyPoints
                                : typeof job.keyPoints === "string"
                                ? job.keyPoints
                                    .split(/\n|\u2022|\.|;/)
                                    .map((s: string) => s.trim())
                                    .filter((s: string) => s.length > 0)
                                : [];
                              return items.length > 0 ? (
                                <ul className="list-disc pl-5 text-sm leading-relaxed">
                                  {items.map((kp: string, i: number) => (
                                    <li key={i}>{kp}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No key points available.
                                </p>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            selectedJobs.includes(job.id)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => toggleJobSelection(job.id)}
                          disabled={isApplying}
                        >
                          {selectedJobs.includes(job.id) ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-4">
                      {job.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isApplying || isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Loading...
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}

            {selectedJobs.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  size="lg"
                  className="px-8"
                  onClick={handleApplyToJobs}
                  disabled={isApplying}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Apply to {selectedJobs.length} Selected Job
                      {selectedJobs.length > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            )}

            {isApplying && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              >
                <Card className="w-full max-w-md bg-white shadow-2xl border-primary/10">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <motion.div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                        <motion.div
                          className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Briefcase className="h-8 w-8 text-primary" />
                        </div>
                      </div>

                      <motion.h4
                        className="text-xl font-bold text-foreground mb-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Application in Progress
                      </motion.h4>

                      <div className="h-8 mb-6 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={currentApplicationStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-muted-foreground text-sm font-medium"
                          >
                            {currentApplicationStep}
                          </motion.p>
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <span>Progress</span>
                          <span>
                            {Math.round(
                              (currentJobIndex / selectedJobs.length) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                (currentJobIndex / selectedJobs.length) * 100
                              }%`,
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Applying to {currentJobIndex + 1} of{" "}
                          {selectedJobs.length} jobs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {showApplicationResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto mt-12"
              >
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <h4 className="text-2xl font-bold text-green-900 mb-3">
                        Applications Submitted!
                      </h4>
                      <p className="text-green-700/80 max-w-md mx-auto leading-relaxed">
                        You've successfully processed{" "}
                        <span className="font-semibold">
                          {selectedJobs.length}
                        </span>{" "}
                        {selectedJobs.length === 1 ? "job" : "jobs"}. Check your
                        email for confirmation details.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {selectedJobs.map((jobId, index) => {
                        const job = jobs.find((j) => j.id === jobId);
                        const status = applicationProgress[jobId];

                        return (
                          <motion.div
                            key={jobId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between bg-white p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow group"
                          >
                            <div className="flex items-center gap-4 overflow-hidden flex-1">
                              <div
                                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                  status === "completed"
                                    ? "bg-green-100 text-green-600"
                                    : status === "failed"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-yellow-100 text-yellow-600"
                                }`}
                              >
                                {status === "completed" ? (
                                  <CheckCircle className="h-5 w-5" />
                                ) : status === "failed" ? (
                                  <X className="h-5 w-5" />
                                ) : (
                                  <Clock className="h-5 w-5" />
                                )}
                              </div>

                              <div className="flex flex-col min-w-0 flex-1">
                                <span
                                  className="font-semibold text-gray-900 truncate block"
                                  title={job?.title}
                                >
                                  {job?.title}
                                </span>
                                <span
                                  className="text-sm text-muted-foreground truncate block"
                                  title={job?.company}
                                >
                                  {job?.company}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 pl-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                  status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "failed"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {status === "completed"
                                  ? "Applied"
                                  : status === "failed"
                                  ? "Failed"
                                  : "Skipped"}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">
              LinkedIn Resume Apply Automation
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2024 McMaster 4FD3 Project. Built for future innovators.
          </p>
        </div>
      </footer>
    </div>
  );
}
