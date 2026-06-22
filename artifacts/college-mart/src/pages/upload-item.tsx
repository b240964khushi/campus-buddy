import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateItem, getListItemsQueryKey, getGetItemStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const itemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sellerWhatsapp: z.string().min(10, "Please enter a valid WhatsApp number"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function UploadItem() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthLoading && !token) {
      setLocation("/login");
    }
  }, [token, isAuthLoading, setLocation]);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      condition: "Good",
      description: "",
      sellerWhatsapp: "",
    },
  });

  const createItemMutation = useCreateItem();

  const onSubmit = (data: ItemFormValues) => {
    createItemMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Item listed successfully!" });
        queryClient.invalidateQueries({ queryKey: getListItemsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetItemStatsQueryKey() });
        setLocation("/items");
      },
      onError: (err) => {
        toast({ 
          title: "Failed to list item", 
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
          <h1 className="text-3xl font-bold text-foreground">Upload Item</h1>
          <p className="text-muted-foreground mt-2">List your unused stationery and books for others to buy.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 md:p-8 rounded-2xl border shadow-sm"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Omega Drafter Pro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0 for free" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Drafter">Drafter</SelectItem>
                          <SelectItem value="Sheet Holder">Sheet Holder</SelectItem>
                          <SelectItem value="Lab Coat">Lab Coat</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Notes">Notes</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellerWhatsapp"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Your WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 9876543210 (include country code if needed)" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">Buyers will message you directly on this number.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the item, its usage, any wear and tear..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto"
                  disabled={createItemMutation.isPending}
                >
                  {createItemMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                  List Item
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </Layout>
  );
}
