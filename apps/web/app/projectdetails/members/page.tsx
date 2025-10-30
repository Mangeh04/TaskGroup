import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";
import { EmptyUser } from "@/components/nav/empty-users";
import * as React from "react";
import {
  MemberCard,
  MemberCardProps,
  MemberStatus,
} from "@/app/projectdetails/members/components/merber";

type UserData = MemberCardProps & { status: MemberStatus };

export default function MembersPage() {
  const users: Array<UserData> = [
    {
      name: "mangeh04",
      email: "mapsantamaria@esei.uvigo.es",
      avatar: "https://github.com/shadcn.png",
      status: "online",
    },
    {
      name: "blackfox099",
      email: "urgonzalez@esei.uvigo.es",
      avatar: "https://github.com/shadcn.png",
      status: "away",
    },
    {
      name: "axiur",
      email: "axiur@esei.uvigo.es",
      avatar: "https://github.com/shadcn.png",
      status: "do not disturb",
    },
    {
      name: "alejandropxrez",
      email: "apmosquera@esei.uvigo.es",
      avatar: "https://github.com/shadcn.png",
      status: "offline",
    },
  ];

  const hasMembers = users.length > 0;

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <SidebarProvider>
        <AppSidebar
          isProject={true}
          hasMembers={true}
        />
        <SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
          <header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Members</h1>
          </header>

          {hasMembers ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user, index) => (
                <MemberCard
                  key={index}
                  name={ user.name}
                  email={ user.email}
                  avatar={ user.avatar}
                  status={ user.status}
                />
              ))}

            </div>
          ) : (
            <EmptyUser/>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}