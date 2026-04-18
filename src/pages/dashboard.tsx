import { useGetDashboardSummary, useGetMembersActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckSquare, ClipboardList, Target } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: activities, isLoading: isLoadingActivities } = useGetMembersActivity();

  if (isLoadingSummary || isLoadingActivities) {
    return <div className="text-muted-foreground p-8 animate-pulse">Loading dashboard...</div>;
  }

  if (!summary || !activities) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of team activity and status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMembers}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Updates Today</CardTitle>
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.updatesToday}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Assigned Tasks</CardTitle>
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTasksAssigned}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Submitted Today</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.membersSubmittedToday} / {summary.totalMembers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.userId} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div>
                  <Link href={`/members/${activity.userId}`} className="font-semibold hover:underline">
                    {activity.name}
                  </Link>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    {activity.submittedToday ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Submitted
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        Pending update
                      </span>
                    )}
                    <span>•</span>
                    <span>{activity.pendingTasks} tasks pending</span>
                  </div>
                </div>
                <Link href={`/members/${activity.userId}`} className="text-sm text-primary font-medium">
                  View
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
