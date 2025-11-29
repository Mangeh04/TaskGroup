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
import { useTranslations } from "next-intl";

type UserContextType = {
	user: ProfileEndpoint | null;
	loading: boolean;
	refetchUser: () => Promise<void>;
	logout: () => void;
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
	const [loading, setLoading] = useState<boolean>(true);

	const t = useTranslations("toast");

	const refetchUser = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await fetcher<ProfileEndpoint>(
				"/user/profile",
				{
					method: "GET",
					needsAuth: true,
				}
			);

			if (status === 401) {
				setUser(null);
				return;
			}

			if (error || !data) {
				console.error("Error loading profile:", error);
				toast.error(t("profileError"));
				return;
			}

			setUser(data);
		} finally {
			setLoading(false);
		}
	}, [t]);

	useEffect(() => {
		if (initialUser) {
			setLoading(false);
			return;
		}

		void refetchUser();
	}, [initialUser, refetchUser]);

	const logout = useCallback(() => {
		setUser(null);
		setLoading(false);
	}, []);

	const value = useMemo(
		() => ({
			user,
			loading,
			refetchUser,
			logout,
		}),
		[user, loading, refetchUser, logout]
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
