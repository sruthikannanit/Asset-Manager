import { useGetMembersActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Members() {
  const { data: activities, isLoading } = useGetMembersActivity();

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Loading members...</div>;
  if (!activities) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Team Members</h1>
          <p className="text-muted-foreground">View and manage team activity.</p>
        </div>
        <Link href="/assign-task">
          <Button>Assign Task</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <Card key={activity.userId} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <Link href={`/members/${activity.userId}`} className="hover:underline">
                  {activity.name}
                </Link>
              </CardTitle>
              <div className="text-sm text-muted-foreground">{activity.email}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Today</span>
                  <span className={activity.submittedToday ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                    {activity.submittedToday ? "Submitted" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Tasks</span>
                  <span className="font-medium">{activity.pendingTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Updates</span>
                  <span className="font-medium">{activity.totalUpdates}</span>
                </div>
                {activity.lastUpdateDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Update</span>
                    <span className="font-medium">{format(new Date(activity.lastUpdateDate), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
