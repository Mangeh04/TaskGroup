import { Card } from "@/components/ui/card"
import { CalendarDays, User, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Skeleton } from "@/components/ui/skeleton";

export type TaskCardProps = {
  title: string
  description: string
  user: string
  state: "Pending" | "Done"
  date: Date
  onEdit?: () => void
  onDelete?: () => void
}

export function TaskCard({ title, description, user, state, date, onEdit, onDelete }: TaskCardProps) {
  const badgeVariant = state === "Done" ? "green" : "destructive"

  return (
    <Card className="relative p-5 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <Badge
        variant={badgeVariant}
        className="absolute top-3 right-3 px-3 py-1 text-xs"
      >
        {state}
      </Badge>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 size-8 rounded-full bg-black flex items-center justify-center text-white font-semibold">
          {title[0]}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <CalendarDays className="size-3.5 mr-1" />
            <span>Created on {date.toDateString()}</span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <User className="size-3.5 mr-1" />
            <span>{user}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Edit className="size-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </Card>
  )
}

export function SkeletonCard() {
  return (
    <div
      data-task-card
      className="
        relative p-5 rounded-2xl border border-border/40 bg-card
        shadow-sm hover:shadow-md transition-all duration-300
      "
    >
      <Skeleton className="absolute top-3 right-3 h-5 w-14 rounded-full bg-neutral-300/70 animate-pulse" />

      <div className="flex items-start gap-4">
        <Skeleton className="size-8 rounded-full bg-neutral-300/80 animate-pulse flex-shrink-0" />

        <div className="flex flex-col gap-1 flex-1">
          <Skeleton className="h-5 w-48 rounded-md bg-neutral-300/80 animate-pulse" />
          <Skeleton className="h-4 w-72 rounded-md bg-neutral-300/80 animate-pulse" />

          <div className="flex items-center mt-2 gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded-sm bg-neutral-300/80 animate-pulse" />
            <Skeleton className="h-3.5 w-40 rounded-md bg-neutral-300/80 animate-pulse" />
          </div>

          <div className="flex items-center mt-1 gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded-sm bg-neutral-300/80 animate-pulse" />
            <Skeleton className="h-3.5 w-28 rounded-md bg-neutral-300/80 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-md bg-neutral-300/80 animate-pulse" />
        <Skeleton className="h-8 w-8 rounded-md bg-neutral-300/80 animate-pulse" />
      </div>
    </div>
  );
}