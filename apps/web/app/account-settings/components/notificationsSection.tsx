import { Card, CardContent} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function NotificationsSection() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Notification</h1>
            </div>

            <Card>
                <CardContent className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Enable desktop notification</h3>
                            <p className="text-muted-foreground text-sm">
                                Decide whether you want to be notified of new message & updates
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="font-medium">Enable unread notification badge</h3>

                        <RadioGroup defaultValue="all" className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <RadioGroupItem value="all" id="all" className="mt-1" />
                                <div>
                                    <Label htmlFor="all" className="font-medium">
                                        All new alerts
                                    </Label>
                                    <p className="text-muted-foreground text-sm">
                                        Broadcast notifications to the channel for each new alert
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <RadioGroupItem value="nothing" id="nothing" className="mt-1" />
                                <div>
                                    <Label htmlFor="nothing" className="font-medium">
                                        Nothing
                                    </Label>
                                    <p className="text-muted-foreground text-sm">Don&#39;t notify me anything</p>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
