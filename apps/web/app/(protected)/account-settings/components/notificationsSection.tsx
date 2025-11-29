"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export function NotificationsSection() {
	const t = useTranslations("settings.notifications");

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-balance">
					{t("title")}
				</h1>
			</div>

			<Card>
				<CardContent className="space-y-6 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium">{t("desktopTitle")}</h3>
							<p className="text-muted-foreground text-sm">
								{t("desktopDescription")}
							</p>
						</div>
						<Switch defaultChecked />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
