import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Progress() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Progress</h1>
          <p className="text-muted-foreground">Track your improvement over time</p>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md mx-auto bg-gradient-card shadow-card">
          <CardHeader className="text-center">
            <BarChart3 className="h-16 w-16 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl">Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This page is currently in development. Here you'll be able to view progress charts, statistics, and performance analytics.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Coming Soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}