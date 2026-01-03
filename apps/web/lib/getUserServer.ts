import { cookies } from "next/headers";
import type { ProfileEndpoint } from "@repo/types";

import { fetcher } from "lib/api";

export const getUserServer = async (): Promise<ProfileEndpoint | null> => {
	const cookieStore = await cookies();
	const allCookies = cookieStore.getAll();

	if (allCookies.length === 0) return null;

	const cookieHeader = allCookies
		.map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
		.join("; ");

	const { data, error } = await fetcher<ProfileEndpoint>("/user/profile", {
		method: "GET",
		needsAuth: true,
		headers: {
			Cookie: cookieHeader,
		},
	});

	if (error) {
		console.error("Error fetching user on server", {
			codes: error.codes,
			raw: error.raw,
		});
		return null;
	}

	return data ?? null;
};
