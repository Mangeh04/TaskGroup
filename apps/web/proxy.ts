import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "access_token";

const PUBLIC_ROUTES = ["/login", "/register"];

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
	const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

	if (!isPublicRoute && !token) {
		const loginUrl = new URL("/login", req.url);
		return NextResponse.redirect(loginUrl);
	}

	if (isPublicRoute && token) {
		const dashboardUrl = new URL("/dashboard", req.url);
		return NextResponse.redirect(dashboardUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/account-settings/:path*",
		"/group-information/:path*",
		"/inbox/:path*",
	],
};
