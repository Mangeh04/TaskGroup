import { Card } from "@/components/ui/card"
import { CalendarDays, User, Edit} from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/custom/confirmation";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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

  const users: Array<string> = [
    "mangeh04",
    "blackfox099",
    "axiur",
    "alejandropxrez",
  ];

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
        <CustomDialog
          title={`Editing task "${title}"`}
          subtitle={"Fill out only the values you want to change. If a field is left empty, it will not be changed."}
          confirmIcon={
            <Edit/>
          }
          isIcon={true}
        >
          <Label htmlFor="task-name">Task name</Label>
          <Input id="task-name" name="Task Name" placeholder="Incredible Task" />
          <Label htmlFor="task-description">Task description</Label>
          <Input id="task-description" name="Task Description" placeholder="Description of the Task" />
          <Label htmlFor="task-user">Assigned User</Label>
          <div className="w-full flex flex-row items-center justify-between">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assigned User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user, index) => (
                  <SelectItem key={`user_${index}`} value={`user_${index}`}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Label htmlFor="task-state">State</Label>
              <Switch id="task-state" />
            </div>
          </div>
        </CustomDialog>

        <ConfirmationDialog
          dialogAction="delete"
          text={`The task "${title}" will be deleted permanently!`}
          objective={"task"}
        >
        </ConfirmationDialog>
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