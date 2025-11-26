import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverviewCard() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Project overview</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-3">
        <div className="flex items-center justify-between">
          <span>Created</span>
          <span>2025-10-15</span>
        </div>
      </CardContent>
    </Card>
  );
}