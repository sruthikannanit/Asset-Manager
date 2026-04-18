import { useParams } from "wouter";
import { useListUpdates, useListTasks, useListUsers, useDeleteTask, getListTasksQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function MemberDetail() {
  const { userId } = useParams();
  const id = Number(userId);
  const { data: users } = useListUsers();
  const { data: updates } = useListUpdates({ userId: id });
  const { data: tasks } = useListTasks({ userId: id });
  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const user = users?.find(u => u.id === id);

  const handleDeleteTask = (taskId: number) => {
    if (!confirm("Delete this task?")) return;
    deleteTask.mutate({ id: taskId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ userId: id }) });
        toast({ title: "Task deleted" });
      }
    });
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Assigned Tasks</h2>
          {tasks && tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <Card key={task.id}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium mb-1">{task.task}</div>
                      <div className="text-sm text-muted-foreground">Due: {format(new Date(task.date), "MMM d, yyyy")}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border border-dashed">No assigned tasks.</div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Update History</h2>
          {updates && updates.length > 0 ? (
            <div className="space-y-3">
              {updates.map(update => (
                <Card key={update.id}>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-2 font-medium">
                      {format(new Date(update.date), "EEEE, MMM d, yyyy")}
                    </div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{update.text}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border border-dashed">No updates submitted yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
