import Link from "next/link";
import { CheckCircle2, LogIn, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function MainPage() {
	const t = useTranslations("landing");
	return (
		<main className="min-h-screen bg-linear-to-bl from-slate-950 via-slate-900 to-slate-950 text-slate-50">
			<div className="mx-auto flex h-full min-h-screen max-w-5xl flex-col px-4 py-10 md:px-8 md:py-16">
				<header className="mb-10 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-500/40">
							<CheckCircle2 className="h-5 w-5" />
						</span>
						<span className="text-lg font-semibold tracking-tight">
							{t("header.brand")}
						</span>
					</div>
				</header>

				<section className="flex flex-1 flex-col items-center justify-center gap-10 md:flex-row">
					<div className="max-w-xl space-y-6">
						<p className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-sky-300">
							{t("hero.badge")}
						</p>

						<h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
							{t("hero.title")}
						</h1>

						<p className="text-balance text-sm text-slate-300 md:text-base">
							{t("hero.description")}
						</p>

						<div className="flex flex-wrap items-center gap-4">
							<Button variant="outline" size="lg" asChild>
								<Link href="/register">
									{t("hero.startNow")}
									<UserPlus className="ml-2 h-4 w-4" />
								</Link>
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20"
								asChild
							>
								<Link href="/login">
									{t("hero.alreadyHaveAccount")}
									<LogIn className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>

						<div className="flex items-center gap-2 text-xs text-slate-400">
							<Users className="h-4 w-4" />
							<span>{t("hero.idealFor")}</span>
						</div>
					</div>

					<Card className="w-full max-w-md border-slate-800 bg-slate-900/60 backdrop-blur">
						<CardHeader>
							<CardTitle className="text-lg">
								<p className="text-white">
									{t("features.title")}
								</p>
							</CardTitle>
							<CardDescription>
								{t("features.subtitle")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 text-sm text-slate-200">
							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
								<div>
									<p className="font-medium">
										{t("features.manage.title")}
									</p>
									<p className="text-xs text-slate-400">
										{t("features.manage.description")}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
								<div>
									<p className="font-medium">
										{t("features.assign.title")}
									</p>
									<p className="text-xs text-slate-400">
										{t("features.assign.description")}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
								<div>
									<p className="font-medium">
										{t("features.progress.title")}
									</p>
									<p className="text-xs text-slate-400">
										{t("features.progress.description")}
									</p>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col items-start gap-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
							<p className="font-semibold text-slate-300">
								{t("features.developedBy")}
							</p>
							<ul className="space-y-1 text-slate-400">
								<li>• Alejandro Pérez Mosquera</li>
								<li>• Uxío Raluy González</li>
								<li>• Miguen Ángel Prol Santamaria</li>
							</ul>
						</CardFooter>
					</Card>
				</section>

				<footer className="mt-10 border-t border-slate-800 pt-4 text-xs text-slate-500">
					© {new Date().getFullYear()} TaskGroup.{" "}
					{t("footer.rights")}
				</footer>
			</div>
		</main>
	);
}
