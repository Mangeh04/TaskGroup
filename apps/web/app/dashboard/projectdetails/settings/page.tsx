"use client";

import { useMemo, useState } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { DangerZone } from "./components/dangerZone";
import { OverviewCard } from "./components/overviewCard";
import { GeneralSettings } from "./components/generalSettings";
import { TeamSettings } from "./components/teamSettings";

const users: Array<{
  id: string;
  username: string;
  role: "Owner" | "Admin" | "Member";
}> = [
  { id: "1", username: "mangeh04", role: "Owner" },
  { id: "2", username: "blackfox099", role: "Admin" },
  { id: "3", username: "axiur", role: "Member" },
  { id: "4", username: "alejandropxrez", role: "Member" },
];

export default function SettingsPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Project", href: "/dashboard/projectdetails" },
  ];

  const memberCount = users.length;
  const adminCount = useMemo(
    () => users.filter((u) => u.role !== "Member").length,
    [],
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-white dark:bg-neutral-950">
      <SidebarProvider>
        <AppSidebar isProject={true} hasMembers={memberCount > 0} />
        <SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
          <header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
            <SidebarTrigger />
            <BreadCrumbCustom
              items={breadcrumbItems}
              currentPage="Settings"
            />

            <div className="ml-auto flex items-center gap-4">
              <Badge variant="secondary" className="rounded-xl">
                {memberCount} members
              </Badge>
              <Badge variant="outline" className="rounded-xl">
                {adminCount} admins
              </Badge>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-4">
                <OverviewCard />
                <DangerZone />
              </div>

              <div className="lg:col-span-8">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    <GeneralSettings />
                  </TabsContent>

                  <TabsContent value="team" className="space-y-6">
                    <TeamSettings users={users} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
