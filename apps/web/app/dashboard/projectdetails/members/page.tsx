import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";
import { EmptyUser } from "@/components/nav/empty-users";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomDialog } from "@/components/custom/dialog";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";

import { ScrollArea } from "@/components/ui/scroll-area";

import Image from "next/image";
import buttonIcon from "@/public/images/add-member.webp";

import {
  MemberCard,
  MemberCardProps,
  MemberStatus,
} from "./components/member";

type UserData = MemberCardProps & { status: MemberStatus };

export default function MembersPage() {
  const users: Array<UserData> = [
    {
      name: "mangeh04",
      email: "mapsantamaria@esei.uvigo.es",
      avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
      status: "online",
    },
    {
      name: "blackfox099",
      email: "urgonzalez@esei.uvigo.es",
      avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/mike.jpg",
      status: "away",
    },
    {
      name: "axiur",
      email: "axiur@esei.uvigo.es",
      avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/speed.webp",
      status: "do not disturb",
    },
    {
      name: "alejandropxrez",
      email: "apmosquera@esei.uvigo.es",
      avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/miketyson.jpg",
      status: "offline",
    },
  ];

  const hasMembers = users.length > 0;
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Project", href: "/dashboard/projectdetails" }
  ];

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
            <BreadCrumbCustom
              items={breadcrumbItems}
              currentPage="Members"
            />
          </header>

          {hasMembers ? (
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4">
                <div className="mb-4">
                  <CustomDialog
                    buttonString="Invite Members"
                    title="Invite a new User"
                    subtitle="Invite a person here. Introduce his email to invite."
                    confirmIcon={
                      <Image src={buttonIcon} width={15} height={15} alt={"Add new members to the project"}/>
                    }
                  >
                    <Label htmlFor="user-email-inv">Task Name</Label>
                    <Input id="user-email-inv" name="User Email Invitation" placeholder="a@example.com" />
                  </CustomDialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

              </div>
            </ScrollArea>
          ) : (
            <EmptyUser/>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}