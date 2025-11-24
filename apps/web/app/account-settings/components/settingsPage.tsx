"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import {
	User as UserIcon,
	Shield,
	Bell,
	Menu,
	X,
	LayoutDashboard,
	Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { SecuritySection } from "./securitySection";
import { ProfileSection } from "./profileSection";
import { NotificationsSection } from "./notificationsSection";
import { AppearanceSection } from "./appearanceSection";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";

import type { User } from "@repo/types";

type SectionId = "profile" | "security" | "notifications" | "appearance";

const sidebarItems: Array<{ id: SectionId; label: string; icon: any }> = [
	{ id: "profile", label: "Profile", icon: UserIcon },
	{ id: "security", label: "Security", icon: Shield },
	{ id: "notifications", label: "Notification", icon: Bell },
	{ id: "appearance", label: "Appearance", icon: Palette },
];

export function SettingsPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const initialSection =
		(searchParams.get("section") as SectionId) ?? "profile";
	const [activeSection, setActiveSection] =
		useState<SectionId>(initialSection);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [user, setUser] = useState<User | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);

	const fetchUser = useCallback(async () => {
		setLoadingUser(true);

		const { data, error } = await fetcher<User>("/user/profile", {
			method: "GET",
			needsAuth: true,
		});

		if (error) {
			toast.error("Failed to load user profile");
			console.error(error);
		} else {
			setUser(data);
		}
	}, []);

	const data = {
		user: {
			alias: "Mangeh04",
			email: "mapsantamaria@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
		},
	};

	const accoutSettingsUser = user
		? {
				alias: user.alias,
				email: user.email,
				avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
			}
		: data.user;

	useEffect(() => void fetchUser(), [fetchUser]);

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
		const urlSection =
			(searchParams.get("section") as SectionId) ?? "profile";
		if (urlSection !== activeSection) {
			setActiveSection(urlSection);
		}
	}, [activeSection, searchParams]);

	const renderContent = () => {
		switch (activeSection) {
			case "profile":
				return <ProfileSection user={accoutSettingsUser} />;
			case "security":
				return <SecuritySection email={accoutSettingsUser.email} />;
			case "notifications":
				return <NotificationsSection />;
			case "appearance":
				return <AppearanceSection />;
			default:
				return <ProfileSection user={accoutSettingsUser} />;
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
					{sidebarOpen ? (
						<X className="h-4 w-4" />
					) : (
						<Menu className="h-4 w-4" />
					)}
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
						<button
							onClick={() => router.push("/dashboard")}
							className={cn(
								"flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
								"text-muted-foreground hover:text-foreground hover:bg-secondary/50"
							)}
						>
							<LayoutDashboard className="h-4 w-4" />
							Dashboard
						</button>

						<hr className="my-2 border-border" />

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
