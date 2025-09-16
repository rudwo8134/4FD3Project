"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface ResumeFile {
  file: File
  id: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedData?: {
    name: string
    email: string
    phone: string
    skills: string[]
    experience: string[]
  }
  error?: string
}

export function ResumeUpload() {
  const [files, setFiles] = useState<ResumeFile[]>([])
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "uploading" as const,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload and processing
    newFiles.forEach((fileObj) => {
      simulateUpload(fileObj.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  })

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "processing",
                  progress: 100,
                }
              : f,
          ),
        )

        // Simulate processing
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "completed",
                    extractedData: {
                      name: "John Doe",
                      email: "john.doe@email.com",
                      phone: "+1 (555) 123-4567",
                      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
                      experience: [
                        "Software Engineer at Tech Corp (2021-2023)",
                        "Junior Developer at StartupXYZ (2020-2021)",
                      ],
                    },
                  }
                : f,
            ),
          )
        }, 2000)
      } else {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleStartJobSearch = () => {
    const completedFile = files.find((f) => f.status === "completed")
    if (completedFile && jobTitle) {
      // This would trigger the job discovery process
      console.log("Starting job search with:", {
        resume: completedFile.extractedData,
        jobTitle,
        location,
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            Upload your resume (PDF, DOC, or DOCX) up to 10MB. We'll extract your skills and experience automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop your resume here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop your resume here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                <Button variant="outline">Choose File</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{fileObj.file.name}</span>
                    {fileObj.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {fileObj.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(fileObj.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {fileObj.status === "uploading" && (
                  <div className="space-y-2">
                    <Progress value={fileObj.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">Uploading... {Math.round(fileObj.progress)}%</p>
                  </div>
                )}

                {fileObj.status === "processing" && (
                  <div className="space-y-2">
                    <Progress value={100} className="h-2" />
                    <p className="text-sm text-muted-foreground">Processing resume and extracting information...</p>
                  </div>
                )}

                {fileObj.status === "completed" && fileObj.extractedData && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-medium text-sm">Extracted Information:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Contact Info:</p>
                        <p className="text-muted-foreground">{fileObj.extractedData.name}</p>
                        <p className="text-muted-foreground">{fileObj.extractedData.email}</p>
                        <p className="text-muted-foreground">{fileObj.extractedData.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium">Skills:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {fileObj.extractedData.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Experience:</p>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {fileObj.extractedData.experience.map((exp, index) => (
                          <li key={index}>• {exp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {fileObj.status === "error" && (
                  <p className="text-sm text-destructive mt-2">{fileObj.error || "Failed to process resume"}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {files.some((f) => f.status === "completed") && (
        <Card>
          <CardHeader>
            <CardTitle>Job Search Preferences</CardTitle>
            <CardDescription>
              Tell us what kind of job you're looking for to get the most relevant results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Target Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, Remote, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button onClick={handleStartJobSearch} disabled={!jobTitle} className="w-full" size="lg">
              Start Job Discovery
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
