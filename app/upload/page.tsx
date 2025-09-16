import { ResumeUpload } from "@/components/resume-upload"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Resume Upload</h1>
              <p className="text-muted-foreground">
                Upload your resume to get started with automated job discovery and applications.
              </p>
            </div>
            <ResumeUpload />
          </div>
        </main>
      </div>
    </div>
  )
}
