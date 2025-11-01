import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import buttonIcon from "@/public/images/add-member.webp"

export function EmptyUser() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar>
              <AvatarImage src="https://raw.githubusercontent.com/Mangeh04/Storage/main/perro.jpeg" alt="@shadcn"/>
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://raw.githubusercontent.com/Mangeh04/Storage/main/speed.webp" alt="@maxleiter"/>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://raw.githubusercontent.com/Mangeh04/Storage/main/mike.jpg" alt="@evilrabbit"/>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
        </EmptyMedia>
        <EmptyTitle>No Team Members</EmptyTitle>
        <EmptyDescription>
          Invite your team to collaborate on this project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CustomDialog
          buttonString="Invite Members"
          title="Invite a new User"
          subtitle="Invite a person here. Introduce his email to invite."
          confirmIcon={
            <Image
              src={buttonIcon}
              width={15}
              height={15}
              alt="Add new members to the project"
              className="dark:invert dark:brightness-100"
            />
          }
        >
          <Label htmlFor="user-email-inv">Task Name</Label>
          <Input id="user-email-inv" name="User Email Invitation" placeholder="a@example.com" />
        </CustomDialog>
      </EmptyContent>
    </Empty>
  )
}
