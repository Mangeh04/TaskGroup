export type FetcherOptions<TBody> = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: TBody;
	headers?: Record<string, string>;
	needsAuth?: boolean;
};

const API_URL =
	typeof window === "undefined"
		? process.env.NEXT_PUBLIC_API_SERVER_URL
		: process.env.NEXT_PUBLIC_API_URL;

async function safeJsonParse(response: Response) {
	const text = await response.text();
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}

export type ApiError = {
	codes: string[];
	raw?: unknown;
};

export type ApiResponse<T> =
	| { data: T; error: null; status: number }
	| { data: null; error: ApiError; status: number };

function isString(x: unknown): x is string {
	return typeof x === "string";
}

function toStringArray(value: unknown): string[] {
	if (!value) return [];
	if (Array.isArray(value)) return value.filter(isString);
	if (isString(value)) return [value];
	return [];
}

function extractErrorCodes(result: any, response: Response): string[] {
	const fromMessage = toStringArray(result?.message);
	if (fromMessage.length) return fromMessage;

	const nestedMessage = toStringArray(result?.message?.message);
	if (nestedMessage.length) return nestedMessage;

	const fromError = toStringArray(result?.error);
	if (fromError.length) return fromError;

	if (response.statusText) return [response.statusText];
	return ["REQUEST_ERROR"];
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
			return {
				data: null,
				error: {
					codes: extractErrorCodes(result, response),
					raw: result ?? undefined,
				},
				status: response.status,
			};
		}

		if (result === null) {
			return {
				data: null,
				error: { codes: ["EMPTY_SERVER_RESPONSE"] },
				status: response.status,
			};
		}

		return {
			data: result as TResponse,
			error: null,
			status: response.status,
		};
	} catch (err) {
		return {
			data: null,
			error: {
				codes: [err instanceof Error ? err.message : "NETWORK_ERROR"],
			},
			status: 0,
		};
	}
}
