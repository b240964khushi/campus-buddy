import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateDemand, getListDemandsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const demandSchema = z.object({
  itemName: z.string().min(3, "Item name must be at least 3 characters"),
  budget: z.coerce.number().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  posterWhatsapp: z.string().min(10, "Please enter a valid WhatsApp number"),
});

type DemandFormValues = z.infer<typeof demandSchema>;

export default function PostDemand() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthLoading && !token) {
      setLocation("/login");
    }
  }, [token, isAuthLoading, setLocation]);

  const form = useForm<DemandFormValues>({
    resolver: zodResolver(demandSchema),
    defaultValues: {
      itemName: "",
      budget: undefined,
      description: "",
      posterWhatsapp: "",
    },
  });

  const createDemandMutation = useCreateDemand();

  const onSubmit = (data: DemandFormValues) => {
    createDemandMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Demand posted successfully!" });
        queryClient.invalidateQueries({ queryKey: getListDemandsQueryKey() });
        setLocation("/demands");
      },
      onError: (err) => {
        toast({ 
          title: "Failed to post demand", 
          description: err.data?.error || "Something went wrong",
          variant: "destructive"
        });
      }
    });
  };

  if (isAuthLoading || !user) return null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Post a Demand</h1>
          <p className="text-muted-foreground mt-2">Can't find what you're looking for? Ask the community.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 md:p-8 rounded-2xl border shadow-sm"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you need?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Physics 101 Textbook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (₹) - Optional</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Leave empty if flexible" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="posterWhatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mention specific editions, requirements, or urgency..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto"
                  disabled={createDemandMutation.isPending}
                >
                  {createDemandMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                  Post Demand
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </Layout>
  );
}
