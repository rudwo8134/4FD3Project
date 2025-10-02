"use client";
import { useState } from "react";
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

  const mockResumeData = {
    name: "Eric Shin",
    email: "rudwo8134@gmail.com",
    phone: "+1 (555) 987-6543",
    location: "Vaughan, Ontario",
    title: "Software Engineer | Telecommunication Technician",
    experience: [
      {
        company: "Siemens Ruggedcom",
        position: "Telecommunication Technician",
        duration: "2019 - 2021",
        description:
          "Provided technical support and maintenance for rugged telecommunication systems by creating detailed reports on unit issues for Test and QA teams, testing prototypes during pre-test and final phases with Siemens software using C#.",
      },
      {
        company: "Baker Health",
        position: "React Native Developer",
        duration: "Project",
        description:
          "Developed a React Native app for patient-doctor real-time connections.",
      },
      {
        company: "Netcoins",
        position: "Mobile App Developer",
        duration: "Project",
        description: "Improved a crypto app with 100,000+ users.",
      },
      {
        company: "DefinedLogic",
        position: "React Native Developer",
        duration: "Project",
        description: "Created a Florida-based rental app using React Native.",
      },
    ],
    skills: [
      // DevOps & Cloud
      "Continuous Deployment",
      "Jenkins",
      "GitLab CI",
      "CircleCI",
      "Travis CI",
      "Docker",
      "Kubernetes",
      "Ansible",
      "Terraform",
      "Chef",
      "Puppet",
      "Helm",
      "Vagrant",
      "Bash",
      "Shell Scripting",
      "CloudFormation",
      "Azure DevOps",
      "GitOps",
      "Build Automation",
      "Release Management",
      "AWS",
      "Azure",
      "Google Cloud Platform",
      "DigitalOcean",
      "Heroku",
      "CloudFront",
      "Cloudflare",
      "Lambda Functions",
      "EC2",
      "S3 Buckets",
      "CloudWatch",
      "CloudTrail",
      "API Gateway",
      "IAM",
      "ECS",
      "EKS",
      "Fargate",
      "Azure Functions",
      "App Engine",
      "Firebase",
      "Supabase",
      // Databases
      "SQL",
      "NoSQL",
      "PostgreSQL",
      "Penetration Testing",
      "Encryption",
    ],
    education: [
      "Bachelor’s degree, Software Engineering | McMaster University (2021 – Present)",
      "\n\n\n\n\n\n",
      "Associate’s degree, Electronics Engineering Technology | Centennial College (2016 - 2019)",
    ],
    summary:
      "Experienced software engineer with a strong background in mobile application development (Android, iOS, React Native) and cloud services, specializing in designing and implementing scalable, reliable, and high-performance software solutions. Adept at software architecture, design patterns, and system optimization to enhance application efficiency and user experience. Skilled in the full software development life cycle (SDLC), including coding standards, peer code reviews, source control management (Git, AWS CodeCommit), CI/CD pipelines, build automation, testing strategies, and deployment processes. Passionate about voice-controlled communication technologies and the future of ambient computing, actively contributing to the development of innovative features for Alexa Calling customers. Experienced in working with cross-functional teams to drive technological advancements, improve system reliability, and deliver seamless multimedia communication experiences through Alexa devices and cloud-based services.",
  };

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUploadedResume(file);
    setIsUploading(false);
    setShowResumeInfo(true);
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
    if (selectedJobs.length === 0) return;

    setIsApplying(true);
    setApplicationProgress({});
    setCurrentJobIndex(0);

    const applicationSteps = [
      "Analyzing job requirements...",
      "Customizing resume for position...",
      "Generating cover letter...",
      "Filling out application form...",
      "Submitting application...",
      "Application submitted successfully!",
    ];

    for (let i = 0; i < selectedJobs.length; i++) {
      const jobId = selectedJobs[i];
      const job = jobs.find((j) => j.id === jobId);
      setCurrentJobIndex(i);

      for (
        let stepIndex = 0;
        stepIndex < applicationSteps.length;
        stepIndex++
      ) {
        const step = applicationSteps[stepIndex];
        setCurrentApplicationStep(`Applying to ${job?.company}: ${step}`);

        // Simulate processing time for each step
        const delay =
          stepIndex === applicationSteps.length - 1
            ? 1000
            : Math.random() * 1500 + 500;
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (stepIndex === applicationSteps.length - 1) {
          setApplicationProgress((prev) => ({
            ...prev,
            [jobId]: "completed",
          }));
        }
      }
    }

    setIsApplying(false);
    setShowApplicationResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">4FD3 Project</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground"
              >
                How it Works
              </a>
              <Button variant="outline">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Automate Your Job Search with AI
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Upload your resume, find relevant jobs, and apply automatically.
            Save hours of manual work with our intelligent job matching system.
          </p>

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
                        <span>{mockResumeData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{mockResumeData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{mockResumeData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{mockResumeData.location}</span>
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
                      {mockResumeData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-primary/20 pl-4"
                        >
                          <div className="font-medium">{exp.position}</div>
                          <div className="text-sm text-muted-foreground">
                            {exp.company} • {exp.duration}
                          </div>
                          <div className="text-sm mt-1">{exp.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {mockResumeData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="font-semibold mb-2">Education</h4>
                    <p className="text-sm text-muted-foreground">
                      {mockResumeData.education}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Job Search Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 relative items-stretch">
              <Input
                placeholder="Enter job title (e.g., Frontend Developer)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="flex-1 min-w-[12rem]"
              />
              <div className="w-full md:w-64 relative">
                <Input
                  placeholder="Enter location (e.g., Toronto)"
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
                    // Debounce inline: wait briefly before fetching
                    await new Promise((r) => setTimeout(r, 200));
                    const params = new URLSearchParams({ q: v });
                    try {
                      const res = await fetch(
                        `/api/locations/search?${params.toString()}`,
                        {
                          cache: "no-store",
                        }
                      );
                      if (!res.ok) throw new Error("Failed to fetch locations");
                      const data = await res.json();
                      const suggestions: string[] = Array.isArray(data?.results)
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
                    setTimeout(() => setShowLocationSuggestions(false), 150)
                  }
                />
                {showLocationSuggestions && (
                  <div className="absolute z-50 left-0 right-0 mt-1 w-full bg-white border rounded-md shadow-sm max-h-56 overflow-auto">
                    {locationSuggestions.map((s) => (
                      <div
                        key={s}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                          setLocation(s);
                          setShowLocationSuggestions(false);
                        }}
                      >
                        {s}
                      </div>
                    ))}
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
                className="px-6 w-full md:w-auto whitespace-nowrap"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Start Job Discovery
                  </>
                )}
              </Button>
            </div>
          </div>

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
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-semibold">{job.title}</h4>
                          {typeof job.suitabilityScore === "number" && (
                            <span
                              className={`px-2 py-1 rounded-full text-sm font-medium ${
                                job.suitabilityScore >= 80
                                  ? "bg-green-100 text-green-700"
                                  : job.suitabilityScore >= 60
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {Math.round(job.suitabilityScore)}%
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
              <div className="max-w-2xl mx-auto mt-8">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <h4 className="text-lg font-semibold text-blue-900">
                          Application in Progress
                        </h4>
                      </div>
                      <p className="text-blue-700 mb-4">
                        {currentApplicationStep}
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              ((currentJobIndex + 1) / selectedJobs.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-blue-600 mt-2">
                        Job {currentJobIndex + 1} of {selectedJobs.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {showApplicationResults && (
              <div className="max-w-2xl mx-auto mt-8">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-green-900 mb-2">
                        Applications Submitted Successfully!
                      </h4>
                      <p className="text-green-700 mb-4">
                        You've successfully applied to {selectedJobs.length} job
                        {selectedJobs.length > 1 ? "s" : ""}. You'll receive
                        email confirmations and updates on your application
                        status.
                      </p>
                      <div className="space-y-2">
                        {selectedJobs.map((jobId) => {
                          const job = jobs.find((j) => j.id === jobId);
                          return (
                            <div
                              key={jobId}
                              className="flex items-center justify-between bg-white rounded-lg p-3"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium">
                                  {job?.title}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  at {job?.company}
                                </span>
                              </div>
                              <span className="text-sm text-green-600 font-medium">
                                Applied
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How 4FD3 Project Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform streamlines your job search process from
              start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Upload Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Upload your resume and let our AI extract your skills and
                  experience
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Find Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Our system searches and matches you with relevant job
                  opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Auto Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Automatically apply to selected jobs with personalized
                  applications
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">4FD3 Project</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 4FD3 Project. Automate your job search with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
