import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import buttonIcon from "@/public/images/add-member.webp";

export default function MembersPage() {
  const users: Array<string> = [
    "mangeh04",
    "blackfox099",
    "axiur",
    "alejandropxrez",
  ];

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
          <header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Members</h1>
          </header>
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/maxleiter.png"
                      alt="@maxleiter"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/evilrabbit.png"
                      alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                </div>
              </EmptyMedia>
              <EmptyTitle>No Team Members</EmptyTitle>
              <EmptyDescription>
                Invite your team to collaborate on this project.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">
                <Image src={buttonIcon} width={18} height={18} alt={"Add new members to the project"}/>
                Invite Members
              </Button>
            </EmptyContent>
          </Empty>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
