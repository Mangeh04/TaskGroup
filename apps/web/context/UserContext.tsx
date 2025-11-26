"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { fetcher } from "@/lib/api";
import { ProfileEndpoint } from "@repo/types";

type UserContextType = {
	user: ProfileEndpoint | null;
	loading: boolean;
	refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<ProfileEndpoint | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
			setLoading(true);

			const { data, error } = await fetcher<ProfileEndpoint>(
				"/user/profile",
				{
					method: "GET",
					needsAuth: true,
				}
			);

			if (error) {
				toast.error("Failed to load user profile");
				console.error(error);
				return;
			}

			setUser(data);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!user) fetchUser();
	}, [user]);

	const value = useMemo(
		() => ({ user, loading, refetchUser: fetchUser }),
		[user, loading]
	);

	return (
		<UserContext.Provider value={value}>{children}</UserContext.Provider>
	);
};

export const useUser = () => {
	const ctx = useContext(UserContext);
	if (!ctx) {
		throw new Error("useUser must be used inside UserProvider");
	}
	return ctx;
};
