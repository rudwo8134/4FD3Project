import { ApplicationTracker } from "@/components/application-tracker"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function TrackerPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Application Tracker</h1>
              <p className="text-muted-foreground">
                Monitor the progress of your automated job applications in real-time.
              </p>
            </div>
            <ApplicationTracker />
          </div>
        </main>
      </div>
    </div>
  )
}
