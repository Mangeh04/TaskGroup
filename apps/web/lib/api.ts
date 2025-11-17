export type ApiResponse<T> =
	| {
			data: T;
			error: null;
	  }
	| {
			data: null;
			error: string;
	  };

export type FetcherOptions<TBody> = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: TBody;
	headers?: Record<string, string>;
	needsAuth?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
			method: options.method || "GET",
			headers,
			body: options.body ? JSON.stringify(options.body) : undefined,
			credentials: options.needsAuth ? "include" : "same-origin",
		});

		const result = await response.json();

		if (!response.ok) {
			const errorMessage =
				result.message || "An error occurred at the petition";
			return { data: null, error: errorMessage };
		}

		return { data: result as TResponse, error: null };
	} catch (error) {
		if (error instanceof Error) {
			return { data: null, error: error.message };
		}
		return { data: null, error: "An unexpected net error ocurred" };
	}
}
