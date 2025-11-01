"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Shield, Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { SecuritySection } from "./components/securitySection";
import { ProfileSection } from "./components/profileSection";
import { NotificationsSection } from "./components/notificationsSection";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SectionId = "profile" | "security" | "notifications";

const sidebarItems: Array<{ id: SectionId; label: string; icon: any }> = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notification", icon: Bell },
];

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSection = (searchParams.get("section") as SectionId) ?? "profile";
  const [activeSection, setActiveSection] = useState<SectionId>(initialSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const baseParams = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams]
  );

  const setSection = (id: SectionId) => {
    setActiveSection(id);
    const params = new URLSearchParams(baseParams);
    params.set("section", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setSidebarOpen(false);
  };

  useEffect(() => {
    const urlSection = (searchParams.get("section") as SectionId) ?? "profile";
    if (urlSection !== activeSection) {
      setActiveSection(urlSection);
    }
  }, [activeSection, searchParams]);

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "security":
        return <SecuritySection />;
      case "notifications":
        return <NotificationsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div
        className={cn(
          "bg-card fixed inset-y-0 left-0 z-40 w-64 transform border-r transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">{renderContent()}</div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
