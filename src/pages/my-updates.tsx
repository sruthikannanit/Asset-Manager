import { useGetMe, useListUpdates, useCreateUpdate, getListUpdatesQueryKey, getGetDashboardSummaryQueryKey, getGetMembersActivityQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const updateSchema = z.object({
  text: z.string().min(1, "Update text is required"),
  date: z.string().min(1, "Date is required"),
});

export default function MyUpdates() {
  const { data: user } = useGetMe();
  const { data: updates } = useListUpdates({ userId: user?.id });
  const createUpdate = useCreateUpdate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: { text: "", date: format(new Date(), "yyyy-MM-dd") },
  });

  const onSubmit = (values: z.infer<typeof updateSchema>) => {
    createUpdate.mutate({ data: values }, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getListUpdatesQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetMembersActivityQueryKey() });
        toast({ title: "Update submitted successfully" });
        form.reset({ text: "", date: format(new Date(), "yyyy-MM-dd") });
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">My Updates</h1>
        <p className="text-muted-foreground">Submit your daily update and view past entries.</p>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Submit Update</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What did you work on?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details of today's work..." className="h-32 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={createUpdate.isPending}>Submit Update</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Previous Updates</h2>
        {updates && updates.length > 0 ? (
          <div className="space-y-3">
            {updates.map((update) => (
              <Card key={update.id}>
                <CardContent className="p-5">
                  <div className="text-sm font-medium text-primary mb-2">
                    {format(new Date(update.date), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{update.text}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-8 text-center bg-muted/50 rounded-lg border border-dashed">
            You haven't submitted any updates yet.
          </div>
        )}
      </div>
    </div>
  );
}
