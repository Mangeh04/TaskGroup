"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo, // Import hooks
} from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import { Loader2 } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import emptyInboxImage from "@/public/images/empty-inbox.webp";

import {
  type NotificationCardProps,
  NotificationCard,
  SkeletonNotificationCard,
} from "@/app/inbox/components/notification";

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

export default function InboxPage() {
  const [isLoading, setIsLoading] = useState(true);

  // This value is now calculated only once.
  const hasNotifications = useMemo(() => data.length > 0, []);

  // Simplified logic: just run a timer on mount.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Set loading to false after 500ms

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on mount.

  // Wrapped in useCallback so they are not recreated on each render.
  // This prevents unnecessary re-renders of NotificationCard components.
  const handleConfirm = useCallback(() => {
    console.log("Invitation Confirmed");
  }, []);

  const handleReject = useCallback(() => {
    console.log("Invitation Rejected");
  }, []);

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
                // Show skeletons while loading
                <div className="flex flex-col p-4 lg:p-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonNotificationCard key={`skeleton_${i}`} />
                  ))}
                </div>
              ) : (
                // Show data once loaded
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