import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MemberStatus = "online" | "offline" | "away" | "do not disturb";

export type MemberCardProps = {
  name: string;
  email: string;
  avatar: string;
  status: MemberStatus;
};

const statusStyles: Record<MemberStatus, { color: string; text: string }> = {
  online: { color: "bg-green-500", text: "Online" },
  offline: { color: "bg-destructive", text: "Offline" },
  away: { color: "bg-yellow-500", text: "Away" },
  "do not disturb": { color: "bg-gray-500", text: "Do not disturb" },
};

export function MemberCard({ name, email, avatar, status }: MemberCardProps) {
  const currentStatus = statusStyles[status];

  return (
    <Card className="relative p-4 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="rounded-full">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <UserX className="mr-2 h-4 w-4" />
              <span>Remove</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-2 w-2 rounded-full",
            currentStatus.color
          )}
        />
        <span className="text-xs text-muted-foreground">
          {currentStatus.text}
        </span>
      </div>
    </Card>
  );
}