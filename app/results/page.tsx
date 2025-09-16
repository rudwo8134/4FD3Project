import { ResultsDashboard } from "@/components/results-dashboard"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function ResultsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Results Dashboard</h1>
              <p className="text-muted-foreground">
                Analyze your job application performance with detailed metrics and insights.
              </p>
            </div>
            <ResultsDashboard />
          </div>
        </main>
      </div>
    </div>
  )
}
