import { JobDiscovery } from "@/components/job-discovery"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DiscoverPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Job Discovery</h1>
              <p className="text-muted-foreground">
                Discover relevant job opportunities based on your resume and preferences.
              </p>
            </div>
            <JobDiscovery />
          </div>
        </main>
      </div>
    </div>
  )
}
