export type FetcherOptions<TBody> = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: TBody;
	headers?: Record<string, string>;
};

// TODO: use TRPC for end to end type safe apis.

export async function fetcher<TResponse, TBody = unknown>(
	url: string,
	options: FetcherOptions<TBody> = {}
): Promise<TResponse> {
	return {} as TResponse;
}
