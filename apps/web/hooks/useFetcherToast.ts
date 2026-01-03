"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { fetcher } from "lib/api";
import type { ApiResponse, FetcherOptions } from "lib/api";

export function useFetcherToast() {
	const tErrors = useTranslations("errors");

	async function fetcherToast<TResponse, TBody = unknown>(
		path: string,
		options: FetcherOptions<TBody> = {},
		opts?: {
			onlyFirst?: boolean;
			fallbackCode?: string;
		}
	): Promise<ApiResponse<TResponse>> {
		const res = await fetcher<TResponse, TBody>(path, options);

		if (res.error) {
			const { onlyFirst = true, fallbackCode = "INTERNAL_SERVER_ERROR" } =
				opts ?? {};

			const codes = res.error.codes ?? [];

			const message =
				codes.length === 0
					? tErrors(fallbackCode)
					: onlyFirst
						? tErrors(codes[0] as string)
						: codes.map((c: string) => tErrors(c)).join("\n");

			toast.error(message);
		}

		return res;
	}

	return fetcherToast;
}
