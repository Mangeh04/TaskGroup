import { cache } from "react";
import { cookies } from "next/headers";

import { fetcher } from "@/lib/api";
import type { ProfileEndpoint } from "@repo/types";

export const getUserServer = cache(
	async (): Promise<ProfileEndpoint | null> => {
		const cookieStore = await cookies();

		const allCookies = cookieStore.getAll();
		if (allCookies.length === 0) return null;

		const cookieHeader = allCookies
			.map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
			.join("; ");

		const { data, error } = await fetcher<ProfileEndpoint>(
			"/user/profile",
			{
				method: "GET",
				needsAuth: true,
				headers: {
					Cookie: cookieHeader,
				},
			}
		);

		if (error || !data) {
			return null;
		}

		return data;
	}
);
