"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [showJobs, setShowJobs] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState<number[]>([])
  const [uploadedResume, setUploadedResume] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showResumeInfo, setShowResumeInfo] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [currentApplicationStep, setCurrentApplicationStep] = useState("")
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [applicationProgress, setApplicationProgress] = useState<{ [key: number]: string }>({})
  const [showApplicationResults, setShowApplicationResults] = useState(false)

  const mockResumeData = {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Frontend Developer",
    experience: [
      {
        company: "Tech Solutions Inc.",
        position: "Senior Frontend Developer",
        duration: "2022 - Present",
        description: "Led development of React-based web applications and mentored junior developers",
      },
      {
        company: "StartupXYZ",
        position: "Frontend Developer",
        duration: "2020 - 2022",
        description: "Built responsive web interfaces using React and TypeScript for various client projects",
      },
    ],
    skills: ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "Node.js", "Git", "HTML/CSS"],
    education: "Computer Science, Stanford University (2016-2020)",
  }

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setUploadedResume(file)
    setIsUploading(false)
    setShowResumeInfo(true)
  }

  const removeResume = () => {
    setUploadedResume(null)
    setShowResumeInfo(false)
  }

  const handleStartDiscovery = async () => {
    if (!uploadedResume) {
      alert("Please upload your resume first")
      return
    }
    if (!jobTitle.trim()) {
      alert("Please enter a job title")
      return
    }

    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsSearching(false)
    setShowJobs(true)
  }

  const mockJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$80,000 - $120,000",
      type: "Full-time",
      posted: "2 days ago",
      description: "We're looking for a passionate Frontend Developer to join our team...",
      match: 95,
    },
    {
      id: 2,
      title: "React Developer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$70,000 - $100,000",
      type: "Full-time",
      posted: "1 day ago",
      description: "Join our growing team as a React Developer and help build amazing user experiences...",
      match: 88,
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Innovation Labs",
      location: "New York, NY",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      posted: "3 days ago",
      description: "We need a versatile Full Stack Developer to work on cutting-edge projects...",
      match: 82,
    },
  ]

  const toggleJobSelection = (jobId: number) => {
    setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleApplyToJobs = async () => {
    if (selectedJobs.length === 0) return

    setIsApplying(true)
    setApplicationProgress({})
    setCurrentJobIndex(0)

    const applicationSteps = [
      "Analyzing job requirements...",
      "Customizing resume for position...",
      "Generating cover letter...",
      "Filling out application form...",
      "Submitting application...",
      "Application submitted successfully!",
    ]

    for (let i = 0; i < selectedJobs.length; i++) {
      const jobId = selectedJobs[i]
      const job = mockJobs.find((j) => j.id === jobId)
      setCurrentJobIndex(i)

      for (let stepIndex = 0; stepIndex < applicationSteps.length; stepIndex++) {
        const step = applicationSteps[stepIndex]
        setCurrentApplicationStep(`Applying to ${job?.company}: ${step}`)

        // Simulate processing time for each step
        const delay = stepIndex === applicationSteps.length - 1 ? 1000 : Math.random() * 1500 + 500
        await new Promise((resolve) => setTimeout(resolve, delay))

        if (stepIndex === applicationSteps.length - 1) {
          setApplicationProgress((prev) => ({
            ...prev,
            [jobId]: "completed",
          }))
        }
      }
    }

    setIsApplying(false)
    setShowApplicationResults(true)
  }

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
              <a href="#features" className="text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
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
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Automate Your Job Search with AI</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Upload your resume, find relevant jobs, and apply automatically. Save hours of manual work with our
            intelligent job matching system.
          </p>

          {/* Resume Upload Section */}
          <div className="max-w-md mx-auto mb-8">
            {!uploadedResume ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 mb-6">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-muted-foreground mb-4">PDF or Word document (max 10MB)</p>
                <Button
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => document.getElementById("resume-upload")?.click()}
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
                        <div key={index} className="border-l-2 border-primary/20 pl-4">
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
                        <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="font-semibold mb-2">Education</h4>
                    <p className="text-sm text-muted-foreground">{mockResumeData.education}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Job Search Form */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                placeholder="Enter job title (e.g., Frontend Developer)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleStartDiscovery}
                disabled={isSearching || !jobTitle.trim() || !uploadedResume}
                className="px-6"
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
              <div className="text-sm text-muted-foreground">Match Accuracy</div>
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
              <h3 className="text-3xl font-bold mb-4">Found {mockJobs.length} Matching Jobs</h3>
              <p className="text-muted-foreground">Select the jobs you'd like to apply to</p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {mockJobs.map((job, index) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-all ${
                    selectedJobs.includes(job.id) ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                  } ${
                    isApplying && currentJobIndex === selectedJobs.indexOf(job.id) && selectedJobs.includes(job.id)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-semibold">{job.title}</h4>
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                            {job.match}% match
                          </span>
                          {isApplying && selectedJobs.includes(job.id) && (
                            <div className="flex items-center gap-2">
                              {applicationProgress[job.id] === "completed" ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">Applied</span>
                                </div>
                              ) : currentJobIndex === selectedJobs.indexOf(job.id) ? (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm font-medium">Applying...</span>
                                </div>
                              ) : selectedJobs.indexOf(job.id) < currentJobIndex ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">Applied</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm font-medium">Waiting...</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-lg text-muted-foreground mb-2">{job.company}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.posted}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedJobs.includes(job.id) ? "default" : "outline"}
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
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedJobs.length > 0 && (
              <div className="text-center mt-8">
                <Button size="lg" className="px-8" onClick={handleApplyToJobs} disabled={isApplying}>
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Apply to {selectedJobs.length} Selected Job{selectedJobs.length > 1 ? "s" : ""}
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
                        <h4 className="text-lg font-semibold text-blue-900">Application in Progress</h4>
                      </div>
                      <p className="text-blue-700 mb-4">{currentApplicationStep}</p>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((currentJobIndex + 1) / selectedJobs.length) * 100}%`,
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
                        You've successfully applied to {selectedJobs.length} job{selectedJobs.length > 1 ? "s" : ""}.
                        You'll receive email confirmations and updates on your application status.
                      </p>
                      <div className="space-y-2">
                        {selectedJobs.map((jobId) => {
                          const job = mockJobs.find((j) => j.id === jobId)
                          return (
                            <div key={jobId} className="flex items-center justify-between bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{job?.title}</span>
                                <span className="text-sm text-muted-foreground">at {job?.company}</span>
                              </div>
                              <span className="text-sm text-green-600 font-medium">Applied</span>
                            </div>
                          )
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
              Our AI-powered platform streamlines your job search process from start to finish
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
                  Upload your resume and let our AI extract your skills and experience
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
                  Our system searches and matches you with relevant job opportunities
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
                  Automatically apply to selected jobs with personalized applications
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
          <p className="text-muted-foreground">© 2024 4FD3 Project. Automate your job search with AI.</p>
        </div>
      </footer>
    </div>
  )
}
