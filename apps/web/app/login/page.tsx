import { LoginForm } from "@/app/login/components/login-form";
import { PublicLanguageSwitcher } from "@/components/custom/publicLanguajeSwitcher";

export default function LoginPage() {
	return (
		<div className="relative bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<div className="absolute right-4 top-4 md:right-8 md:top-8">
				<PublicLanguageSwitcher />
			</div>
			<div className="w-full max-w-sm md:max-w-4xl">
				<LoginForm />
			</div>
		</div>
	);
}
