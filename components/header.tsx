import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your job applications efficiently</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
