import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarDays, User, Check, X} from "lucide-react"


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

import { Button } from "@/components/ui/button";

export type NotificationCardProps = {
  title: string
  description: string
  user: string
  project: string
  date: Date
  type: "Invitation" | "AddedTask"
  onConfirm?: () => void
  onReject?: () => void
}

export function NotificationCard(props: NotificationCardProps) {
  const isInvitation = type === "Invitation";

  return(
      <Card className="w-full max-w-sm">
        {isInvitation ? (
          <div>
            <Button
              className=""
            >
              <Check/>
            </Button>
            <Button
              className=""
            >
              <X/>
            </Button>
          </div>

        ) : (
          
        )}

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 size-8 rounded-full bg-black flex items-center justify-center text-white font-semibold">
              {project[0]}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-shadow-md font-semibold text-foreground tracking-tight">{title}</h3>
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
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
      </Card>
)
}