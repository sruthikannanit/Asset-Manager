import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask, useListUsers, getListTasksQueryKey, getGetDashboardSummaryQueryKey, getGetMembersActivityQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const taskSchema = z.object({
  userId: z.coerce.number().min(1, "Member is required"),
  task: z.string().min(1, "Task description is required"),
  date: z.string().min(1, "Due date is required"),
});

export default function AssignTask() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: users } = useListUsers();
  const createTask = useCreateTask();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { userId: 0, task: "", date: format(new Date(), "yyyy-MM-dd") },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    createTask.mutate({ data: values }, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetMembersActivityQueryKey() });
        toast({ title: "Task assigned successfully" });
        setLocation(`/members/${values.userId}`);
      },
    });
  };

  const members = users?.filter(u => u.role === "member") || [];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Assign Task</h1>
        <p className="text-muted-foreground">Create a new task for a team member.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Member</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map(member => (
                          <SelectItem key={member.id} value={String(member.id)}>{member.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What needs to be done?" className="h-32 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setLocation("/dashboard")}>Cancel</Button>
                <Button type="submit" disabled={createTask.isPending}>Assign Task</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
