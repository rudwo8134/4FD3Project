"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, Calendar, TrendingUp, Target, Clock, CheckCircle, ExternalLink } from "lucide-react"

interface ApplicationResult {
  id: string
  jobTitle: string
  company: string
  appliedDate: Date
  status: "submitted" | "viewed" | "interview" | "rejected" | "offer"
  source: string
  url: string
  responseTime?: number // days
}

const mockResults: ApplicationResult[] = [
  {
    id: "1",
    jobTitle: "Senior Software Engineer",
    company: "TechCorp Inc.",
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "interview",
    source: "LinkedIn",
    url: "https://linkedin.com/jobs/123",
    responseTime: 3,
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    company: "StartupXYZ",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "viewed",
    source: "Indeed",
    url: "https://indeed.com/jobs/456",
    responseTime: 2,
  },
  {
    id: "3",
    jobTitle: "Frontend Engineer",
    company: "Design Co.",
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "rejected",
    source: "Glassdoor",
    url: "https://glassdoor.com/jobs/789",
    responseTime: 7,
  },
  {
    id: "4",
    jobTitle: "Software Engineer II",
    company: "BigTech Corp",
    appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: "offer",
    source: "LinkedIn",
    url: "https://linkedin.com/jobs/101112",
    responseTime: 10,
  },
  {
    id: "5",
    jobTitle: "Backend Developer",
    company: "CloudTech",
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "submitted",
    source: "Indeed",
    url: "https://indeed.com/jobs/555",
  },
]

const statusColors = {
  submitted: "#6b7280",
  viewed: "#3b82f6",
  interview: "#f59e0b",
  rejected: "#ef4444",
  offer: "#10b981",
}

export function ResultsDashboard() {
  const [timeRange, setTimeRange] = useState("30")
  const [results] = useState<ApplicationResult[]>(mockResults)

  // Calculate metrics
  const totalApplications = results.length
  const responseRate = Math.round((results.filter((r) => r.status !== "submitted").length / totalApplications) * 100)
  const interviewRate = Math.round((results.filter((r) => r.status === "interview").length / totalApplications) * 100)
  const offerRate = Math.round((results.filter((r) => r.status === "offer").length / totalApplications) * 100)
  const avgResponseTime = Math.round(
    results.filter((r) => r.responseTime).reduce((acc, r) => acc + (r.responseTime || 0), 0) /
      results.filter((r) => r.responseTime).length,
  )

  // Prepare chart data
  const statusData = Object.entries(
    results.reduce(
      (acc, result) => {
        acc[result.status] = (acc[result.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    color: statusColors[status as keyof typeof statusColors],
  }))

  const sourceData = Object.entries(
    results.reduce(
      (acc, result) => {
        acc[result.source] = (acc[result.source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([source, count]) => ({
    source,
    count,
  }))

  const timelineData = results
    .sort((a, b) => a.appliedDate.getTime() - b.appliedDate.getTime())
    .reduce(
      (acc, result, index) => {
        const date = result.appliedDate.toLocaleDateString()
        const existing = acc.find((item) => item.date === date)
        if (existing) {
          existing.applications += 1
          existing.cumulative = index + 1
        } else {
          acc.push({
            date,
            applications: 1,
            cumulative: index + 1,
          })
        }
        return acc
      },
      [] as Array<{ date: string; applications: number; cumulative: number }>,
    )

  const getStatusBadge = (status: ApplicationResult["status"]) => {
    const variants = {
      submitted: "secondary",
      viewed: "outline",
      interview: "default",
      rejected: "destructive",
      offer: "default",
    } as const

    const colors = {
      submitted: "bg-gray-100 text-gray-800",
      viewed: "bg-blue-100 text-blue-800",
      interview: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      offer: "bg-green-100 text-green-800",
    }

    return <Badge className={colors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const exportResults = () => {
    const csvContent = [
      ["Job Title", "Company", "Applied Date", "Status", "Source", "Response Time (days)"],
      ...results.map((r) => [
        r.jobTitle,
        r.company,
        r.appliedDate.toLocaleDateString(),
        r.status,
        r.source,
        r.responseTime?.toString() || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "job_applications_results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Results Dashboard</CardTitle>
              <CardDescription>Analyze your job application performance and outcomes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportResults} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">Applications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate}%</div>
            <p className="text-xs text-muted-foreground">Employers responded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewRate}%</div>
            <p className="text-xs text-muted-foreground">Got interviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerRate}%</div>
            <p className="text-xs text-muted-foreground">Received offers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">Days to respond</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cumulative" stroke="#059669" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>Complete list of your job applications and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{result.jobTitle}</h4>
                    {getStatusBadge(result.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{result.company}</span>
                    <span>Applied: {result.appliedDate.toLocaleDateString()}</span>
                    <span>Source: {result.source}</span>
                    {result.responseTime && <span>Response: {result.responseTime} days</span>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
