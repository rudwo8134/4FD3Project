"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, XCircle, Play, Pause, RotateCcw, ExternalLink, Eye } from "lucide-react"

interface ApplicationStatus {
  id: string
  jobTitle: string
  company: string
  status: "queued" | "opening" | "filling" | "submitting" | "completed" | "failed" | "paused"
  progress: number
  startTime?: Date
  endTime?: Date
  error?: string
  url: string
  steps: ApplicationStep[]
}

interface ApplicationStep {
  name: string
  status: "pending" | "in-progress" | "completed" | "failed"
  timestamp?: Date
  details?: string
}

const mockApplications: ApplicationStatus[] = [
  {
    id: "1",
    jobTitle: "Senior Software Engineer",
    company: "TechCorp Inc.",
    status: "completed",
    progress: 100,
    startTime: new Date(Date.now() - 300000), // 5 minutes ago
    endTime: new Date(Date.now() - 60000), // 1 minute ago
    url: "https://linkedin.com/jobs/123",
    steps: [
      { name: "Opening job page", status: "completed", timestamp: new Date(Date.now() - 300000) },
      { name: "Filling basic information", status: "completed", timestamp: new Date(Date.now() - 240000) },
      { name: "Uploading resume", status: "completed", timestamp: new Date(Date.now() - 180000) },
      { name: "Filling experience details", status: "completed", timestamp: new Date(Date.now() - 120000) },
      { name: "Submitting application", status: "completed", timestamp: new Date(Date.now() - 60000) },
    ],
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    company: "StartupXYZ",
    status: "filling",
    progress: 60,
    startTime: new Date(Date.now() - 120000), // 2 minutes ago
    url: "https://indeed.com/jobs/456",
    steps: [
      { name: "Opening job page", status: "completed", timestamp: new Date(Date.now() - 120000) },
      { name: "Filling basic information", status: "completed", timestamp: new Date(Date.now() - 90000) },
      { name: "Uploading resume", status: "completed", timestamp: new Date(Date.now() - 60000) },
      { name: "Filling experience details", status: "in-progress", timestamp: new Date(Date.now() - 30000) },
      { name: "Submitting application", status: "pending" },
    ],
  },
  {
    id: "3",
    jobTitle: "Frontend Engineer",
    company: "Design Co.",
    status: "queued",
    progress: 0,
    url: "https://glassdoor.com/jobs/789",
    steps: [
      { name: "Opening job page", status: "pending" },
      { name: "Filling basic information", status: "pending" },
      { name: "Uploading resume", status: "pending" },
      { name: "Filling experience details", status: "pending" },
      { name: "Submitting application", status: "pending" },
    ],
  },
  {
    id: "4",
    jobTitle: "Software Engineer II",
    company: "BigTech Corp",
    status: "failed",
    progress: 40,
    startTime: new Date(Date.now() - 600000), // 10 minutes ago
    endTime: new Date(Date.now() - 480000), // 8 minutes ago
    error: "CAPTCHA detected - manual intervention required",
    url: "https://linkedin.com/jobs/101112",
    steps: [
      { name: "Opening job page", status: "completed", timestamp: new Date(Date.now() - 600000) },
      { name: "Filling basic information", status: "completed", timestamp: new Date(Date.now() - 540000) },
      {
        name: "Uploading resume",
        status: "failed",
        timestamp: new Date(Date.now() - 480000),
        details: "CAPTCHA detected",
      },
      { name: "Filling experience details", status: "pending" },
      { name: "Submitting application", status: "pending" },
    ],
  },
]

export function ApplicationTracker() {
  const [applications, setApplications] = useState<ApplicationStatus[]>(mockApplications)
  const [isRunning, setIsRunning] = useState(false)

  // Simulate progress updates
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.status === "filling" && app.progress < 100) {
            const newProgress = Math.min(app.progress + Math.random() * 10, 100)
            const newStatus = newProgress >= 100 ? "completed" : app.status

            return {
              ...app,
              progress: newProgress,
              status: newStatus,
              endTime: newStatus === "completed" ? new Date() : app.endTime,
            }
          }

          if (app.status === "queued") {
            return {
              ...app,
              status: "opening",
              progress: 10,
              startTime: new Date(),
            }
          }

          if (app.status === "opening") {
            return {
              ...app,
              status: "filling",
              progress: 20,
            }
          }

          return app
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning])

  const getStatusIcon = (status: ApplicationStatus["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "queued":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4 text-primary animate-spin" />
    }
  }

  const getStatusColor = (status: ApplicationStatus["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "failed":
        return "bg-destructive"
      case "paused":
        return "bg-yellow-500"
      case "queued":
        return "bg-muted-foreground"
      default:
        return "bg-primary"
    }
  }

  const getStepIcon = (status: ApplicationStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-primary animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const completedCount = applications.filter((app) => app.status === "completed").length
  const failedCount = applications.filter((app) => app.status === "failed").length
  const inProgressCount = applications.filter((app) => ["opening", "filling", "submitting"].includes(app.status)).length

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  const handleRetry = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: "queued",
              progress: 0,
              error: undefined,
              endTime: undefined,
              steps: app.steps.map((step) => ({
                ...step,
                status: "pending",
                timestamp: undefined,
                details: undefined,
              })),
            }
          : app,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Progress</CardTitle>
              <CardDescription>Monitor your automated job applications in real-time</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleStartPause} variant={isRunning ? "destructive" : "default"}>
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{inProgressCount}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{failedCount}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{applications.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(app.status)}
                  <div>
                    <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
                    <CardDescription>{app.company}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {app.status === "failed" && (
                    <Button size="sm" variant="outline" onClick={() => handleRetry(app.id)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" asChild>
                    <a href={app.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(app.progress)}%</span>
                  </div>
                  <Progress value={app.progress} className="h-2" />
                </div>

                {/* Status Badge and Timing */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {app.status.replace("-", " ")}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {app.startTime && (
                      <span>
                        Started: {app.startTime.toLocaleTimeString()}
                        {app.endTime && <> • Completed: {app.endTime.toLocaleTimeString()}</>}
                      </span>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {app.error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">{app.error}</span>
                  </div>
                )}

                {/* Steps */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Application Steps:</h4>
                  <div className="space-y-2">
                    {app.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        {getStepIcon(step.status)}
                        <span className={step.status === "completed" ? "text-muted-foreground" : ""}>{step.name}</span>
                        {step.timestamp && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {step.timestamp.toLocaleTimeString()}
                          </span>
                        )}
                        {step.details && <span className="text-xs text-destructive">({step.details})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No applications in progress</h3>
            <p className="text-muted-foreground">
              Select jobs from the discovery page to start automated applications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
