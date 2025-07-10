import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC, useTRPCClient } from "@inklate/common/trpc";
import { toast } from "@inklate/ui/sonner";
import { useState } from "react";
import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});
export type FormSchema = z.infer<typeof formSchema>;

export const useWaitlist = () => {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  // Use the correct pattern: queryOptions() + useQuery()
  const waitlistCountQuery = trpc.waitlist.getWaitlistCount.queryOptions();
  const { data } = useQuery(waitlistCountQuery);
  const [success, setSuccess] = useState(false);

  // Use the TRPC client directly for mutations
  const joinWaitlistMutation = useMutation({
    mutationFn: (input: FormSchema) => trpcClient.waitlist.joinWaitlist.mutate(input),
    onSuccess: (result) => {
      setSuccess(true);
      queryClient.setQueryData(waitlistCountQuery.queryKey, (oldData) => ({
        count: (oldData?.count ?? 0) + 1
      }));

      toast.success(result.message);
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  });

  return {
    count: data?.count,
    mutation: joinWaitlistMutation,
    success
  };
};
