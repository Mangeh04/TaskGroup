import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { User } from "@repo/types";

import { Upload } from "lucide-react";

export function ProfileSection({
	user,
}: {
	user: Omit<User, "id" | "createdAt" | "updatedAt" | "status"> & {
		avatar: string;
	};
}) {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-balance">
					Personal information
				</h1>
			</div>

			<Card>
				<CardContent className="p-6">
					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src={user.avatar} />
								<AvatarFallback>AG</AvatarFallback>
							</Avatar>
							<div className="flex gap-2">
								<Button size="sm">
									<Upload />
									Upload image
								</Button>
								<Button variant="outline" size="sm">
									Remove
								</Button>
							</div>
						</div>

						{/* Personal info form */}
						<div className="space-y-2">
							<Label htmlFor="userName">User name</Label>
							<Input id="userName" defaultValue={user.alias} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								defaultValue={user.email}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
