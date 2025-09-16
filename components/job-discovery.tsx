"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Building, Clock, ExternalLink, Star, Filter } from "lucide-react"

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  salary?: string
  description: string
  requirements: string[]
  skills: string[]
  postedDate: string
  relevanceScore: number
  source: "LinkedIn" | "Indeed" | "Glassdoor"
  url: string
  selected: boolean
}

const mockJobs: JobListing[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    description:
      "We're looking for a senior software engineer to join our growing team. You'll work on cutting-edge projects using modern technologies.",
    requirements: ["5+ years experience", "Bachelor's degree", "Strong problem-solving skills"],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    postedDate: "2 days ago",
    relevanceScore: 95,
    source: "LinkedIn",
    url: "https://linkedin.com/jobs/123",
    selected: false,
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Remote",
    salary: "$90k - $130k",
    description:
      "Join our fast-paced startup as a full stack developer. Work with modern tech stack and make a real impact.",
    requirements: ["3+ years experience", "Full stack experience", "Startup experience preferred"],
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "Docker"],
    postedDate: "1 day ago",
    relevanceScore: 88,
    source: "Indeed",
    url: "https://indeed.com/jobs/456",
    selected: false,
  },
  {
    id: "3",
    title: "Frontend Engineer",
    company: "Design Co.",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    description: "We're seeking a talented frontend engineer to create beautiful, responsive user interfaces.",
    requirements: ["4+ years frontend experience", "Design system experience", "Performance optimization"],
    skills: ["React", "TypeScript", "CSS", "Figma", "Jest"],
    postedDate: "3 days ago",
    relevanceScore: 82,
    source: "Glassdoor",
    url: "https://glassdoor.com/jobs/789",
    selected: false,
  },
  {
    id: "4",
    title: "Software Engineer II",
    company: "BigTech Corp",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130k - $200k",
    description:
      "Join one of the world's leading tech companies. Work on products used by millions of users worldwide.",
    requirements: ["3+ years experience", "Computer Science degree", "System design knowledge"],
    skills: ["Java", "Python", "AWS", "Kubernetes", "SQL"],
    postedDate: "1 week ago",
    relevanceScore: 78,
    source: "LinkedIn",
    url: "https://linkedin.com/jobs/101112",
    selected: false,
  },
]

export function JobDiscovery() {
  const [jobs, setJobs] = useState<JobListing[]>(mockJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("All job types")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = jobTypeFilter === "All job types" || job.type === jobTypeFilter

    return matchesSearch && matchesLocation && matchesType
  })

  const selectedJobs = jobs.filter((job) => job.selected)

  const toggleJobSelection = (jobId: string) => {
    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, selected: !job.selected } : job)))
  }

  const handleStartApplications = () => {
    if (selectedJobs.length > 0) {
      console.log("Starting applications for:", selectedJobs)
      // This would navigate to the application tracker
    }
  }

  const refreshJobs = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In real app, this would fetch new jobs
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Job Discovery</CardTitle>
              <CardDescription>
                Found {filteredJobs.length} relevant jobs based on your resume and preferences
              </CardDescription>
            </div>
            <Button onClick={refreshJobs} disabled={isLoading}>
              {isLoading ? "Searching..." : "Refresh Jobs"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Jobs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="mt-6">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="job-type">Job Type</Label>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All job types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All job types">All job types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Jobs Summary */}
      {selectedJobs.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Jobs ({selectedJobs.length})</span>
              <Button onClick={handleStartApplications}>Start Applications</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedJobs.map((job) => (
                <Badge key={job.id} variant="secondary">
                  {job.title} at {job.company}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className={`transition-colors ${job.selected ? "border-primary bg-primary/5" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={job.selected}
                    onCheckedChange={() => toggleJobSelection(job.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{job.relevanceScore}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.postedDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{job.type}</Badge>
                      <Badge variant="outline">{job.source}</Badge>
                      {job.salary && <Badge variant="secondary">{job.salary}</Badge>}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more opportunities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
