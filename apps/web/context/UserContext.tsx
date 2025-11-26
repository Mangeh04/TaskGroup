"use client";

import {
	createContext,
	useContext,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from "react";
import { toast } from "sonner";

import { fetcher } from "@/lib/api";
import type { ProfileEndpoint } from "@repo/types";

type UserContextType = {
	user: ProfileEndpoint | null;
	loading: boolean;
	refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
	children,
	initialUser,
}: {
	children: React.ReactNode;
	initialUser: ProfileEndpoint | null;
}) => {
	const [user, setUser] = useState<ProfileEndpoint | null>(initialUser);
	const [loading, setLoading] = useState(false);

	const refetchUser = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error } = await fetcher<ProfileEndpoint>(
				"/user/profile",
				{
					method: "GET",
					needsAuth: true,
				}
			);

			if (error || !data) {
				toast.error("Failed to load user profile");
				console.error(error);
				return;
			}

			setUser(data);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!initialUser) {
			void refetchUser();
		}
	}, [initialUser, refetchUser]);

	const value = useMemo(
		() => ({ user, loading, refetchUser }),
		[user, loading, refetchUser]
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
