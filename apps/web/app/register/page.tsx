import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-muted/20">
			<form className="w-full max-w-md rounded-xl border bg-background shadow-sm p-6 md:p-8 space-y-6">
				<FieldGroup>
					<FieldSet>
						<FieldLegend className="text-lg font-semibold">
							Register
						</FieldLegend>
						<FieldDescription className="text-muted-foreground">
							Complete the following fields to create your
							account.
						</FieldDescription>

						<div className="mt-6 space-y-6">
							<Field>
								<FieldLabel htmlFor="user_email">
									Email
								</FieldLabel>
								<Input
									id="user_email"
									placeholder="Introduce your email"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="user_username">
									Username
								</FieldLabel>
								<Input
									id="user_username"
									placeholder="Introduce your username"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="user_password">
									Password
								</FieldLabel>
								<Input
									id="user_password"
									type="password"
									placeholder="Introduce your password"
									required
								/>
							</Field>
						</div>
					</FieldSet>

					<FieldSeparator className="my-6" />

					<Field
						orientation="horizontal"
						className="justify-between gap-2 mt-2"
					>
						<Link href="/">
							<Button type="button" variant="outline">
								Log in
							</Button>
						</Link>
						<Button type="submit">Submit</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
