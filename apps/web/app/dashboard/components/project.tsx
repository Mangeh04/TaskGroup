import { Card } from "@/components/ui/card"
import { Users, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge";

export type ProjectCardProps = {
  title: string
  numTasks: number
  numUsers: number
}

export function ProjectCard({ title, numTasks, numUsers }: ProjectCardProps) {
  return (
    <Card className="w-full flex flex-row items-center justify-between p-4 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
      <div className="flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">Project description</p>
      </div>

      <div className="flex flex-row items-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{numTasks}</span>
          <Badge variant="secondary">Tasks</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{numUsers}</span>
          <Badge variant="secondary">Users</Badge>
        </div>
      </div>
    </Card>
  )
}
