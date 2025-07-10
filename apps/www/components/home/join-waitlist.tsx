import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@inklate/ui/form";
import { formSchema, FormSchema, useWaitlist } from "~/hooks/useWaitlist";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@inklate/ui/button";
import { Input } from "@inklate/ui/input";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { useEffect } from "react";

export const JoinWaitList = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });

  const waitlist = useWaitlist();

  const handleSubmit = (data: FormSchema) => {
    waitlist.mutation.mutate({ email: data.email });
  };

  useEffect(() => {
    if (waitlist.success) {
      form.reset();
    }
  }, [waitlist.success]);

  return (
    <motion.div
      className="mt-12 flex justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      disabled={waitlist.mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={waitlist.mutation.isPending}>
              {waitlist.mutation.isPending ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};
