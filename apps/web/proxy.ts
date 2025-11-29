import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "access_token";
const PUBLIC_ROUTES = new Set(["/login", "/register"]);
const PROTECTED_PREFIXES = [
	"/dashboard",
	"/account-settings",
	"/group-information",
	"/inbox",
];

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		PUBLIC_FILE.test(pathname)
	) {
		return NextResponse.next();
	}

	const token = req.cookies.get(AUTH_COOKIE_NAME)?.value || null;

	const isPublicRoute = PUBLIC_ROUTES.has(pathname);
	const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
		pathname.startsWith(prefix)
	);

	if (isProtectedRoute && !token) {
		const loginUrl = req.nextUrl.clone();
		loginUrl.pathname = "/login";
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (isPublicRoute && token) {
		const dashboardUrl = req.nextUrl.clone();
		dashboardUrl.pathname = "/dashboard";
		return NextResponse.redirect(dashboardUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/login",
		"/register",
		"/dashboard/:path*",
		"/account-settings/:path*",
		"/group-information/:path*",
		"/inbox/:path*",
	],
};
