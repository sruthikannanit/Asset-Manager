import { useGetMe, useListTasks } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function MyTasks() {
  const { data: user } = useGetMe();
  const { data: tasks, isLoading } = useListTasks({ userId: user?.id });

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">My Tasks</h1>
        <p className="text-muted-foreground">Tasks assigned to you by your team leader.</p>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="border-l-4 border-l-primary hover:bg-muted/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-base font-medium">{task.task}</div>
                  <div className="text-sm px-3 py-1 bg-muted rounded-full whitespace-nowrap w-fit">
                    Due: {format(new Date(task.date), "MMM d, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-muted/50 rounded-lg border border-dashed text-muted-foreground">
          You don't have any assigned tasks.
        </div>
      )}
    </div>
  );
}
