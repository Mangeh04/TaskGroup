"use client";

import { useState, useEffect, Fragment } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import { Loader2 } from "lucide-react";


import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import emptyInboxImage from "@/public/images/empty-inbox.webp";

import {
  type NotificationCardProps,
  NotificationCard,
  SkeletonNotificationCard,
} from "@/app/inbox/components/notification";

export default function InboxPage() {
  const [isLoading, setIsLoading] = useState(true);

  const data: Array<NotificationCardProps> = [
    {
      user: "mangeh04",
      project: "TaskGroup",
      type: "Invitation",
    },
    {
      user: "axiur",
      project: "Website Redesign",
      type: "AddedTask",
    },
    {
      user: "blackfox099",
      project: "API Development",
      type: "AddedTask",
    },
    {
      user: "alejandropxrez",
      project: "TaskGroup",
      type: "AddedTask",
    },
    {
      user: "mangeh04",
      project: "Mobile App",
      type: "Invitation",
    },
    {
      user: "blackfox099",
      project: "Mobile App",
      type: "Invitation",
    },
    {
      user: "axiur",
      project: "Mobile App",
      type: "Invitation",
    },

  ];

  const hasNotifications = data.length > 0;

  const flashLoading = (minMs = 300) => {
    setIsLoading(true);
    const id = setTimeout(() => setIsLoading(false), minMs);
    return () => clearTimeout(id);
  };

  useEffect(() => {
    const clear = flashLoading(500);
    return () => clear?.();
  }, []);

  const handleConfirm = () => {
    console.log("Invitation Confirmed");
  };

  const handleReject = () => {
    console.log("Invitation Rejected");
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
          <header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Inbox</h1>

            {isLoading && (
              <div className="ml-auto flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
                <span className="text-xs text-muted-foreground">Loading...</span>
              </div>
            )}
          </header>

          {hasNotifications ? (
            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col p-4 lg:p-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonNotificationCard key={`skeleton_${i}`} />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-full p-4 lg:p-6">
                  {data.map((item, index) => (
                    <NotificationCard
                      key={index}
                      user={item.user}
                      project={item.project}
                      type={item.type}
                      onConfirm={handleConfirm}
                      onReject={handleReject}
                    />
                  ))}
                </ScrollArea>
              )}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 overflow-hidden">
              <EmptyPage
                title="Your inbox is empty"
                buttonString="Refresh"
                imageSrc={emptyInboxImage}
                imageAlt="Empty inbox illustration"
              />
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}