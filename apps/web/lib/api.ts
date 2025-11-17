export type ApiResponse<T> =
	| { data: T; error: null }
	| { data: null; error: string };

export type FetcherOptions<TBody> = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: TBody;
	headers?: Record<string, string>;
	needsAuth?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function safeJsonParse(response: Response) {
	const text = await response.text();

	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}

export async function fetcher<TResponse, TBody = unknown>(
	path: string,
	options: FetcherOptions<TBody> = {}
): Promise<ApiResponse<TResponse>> {
	const fullUrl = `${API_URL}${path}`;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...options.headers,
	};

	try {
		const response = await fetch(fullUrl, {
			method: options.method ?? "GET",
			headers,
			body: options.body ? JSON.stringify(options.body) : undefined,
			credentials: options.needsAuth ? "include" : "same-origin",
		});

		const result = await safeJsonParse(response);

		if (!response.ok) {
			const message =
				result?.message ||
				result?.error ||
				response.statusText ||
				"An error occurred at the request";

			return { data: null, error: message };
		}

		if (result === null) {
			return { data: null, error: "Empty server response" };
		}

		return { data: result as TResponse, error: null };
	} catch (err) {
		return {
			data: null,
			error: err instanceof Error ? err.message : "Network error",
		};
	}
}
