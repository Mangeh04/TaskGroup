"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function PublicLanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function onSelectChange(nextLocale: string) {
		startTransition(() => {
			// We set the cookie manually so the server knows the preference on refresh
			document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
			router.refresh();
		});
	}

	return (
		<div className="flex items-center gap-2">
			<Select
				defaultValue={locale}
				onValueChange={onSelectChange}
				disabled={isPending}
			>
				<SelectTrigger className="w-[130px] h-9 bg-transparent border-slate-700 text-slate-200 focus:ring-offset-0 focus:ring-0">
					<div className="flex items-center gap-2">
						<Globe className="h-4 w-4 text-slate-400" />
						<SelectValue placeholder="Language" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="en">English</SelectItem>
					<SelectItem value="es">Español</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
