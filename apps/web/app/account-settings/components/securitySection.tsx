import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">Password</h1>
        <p className="text-muted-foreground mt-1">
          Remember, your password is your digital key to your account. Keep it safe, keep it secure!
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" type="password" defaultValue="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" defaultValue="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" type="password" defaultValue="••••••••" />
          </div>

          <div className="flex justify-end">
            <Button>Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
