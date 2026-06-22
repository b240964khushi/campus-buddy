import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { useListItems, getListItemsQueryKey, useGetItemStats, getGetItemStatsQueryKey, useDeleteItem } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2, IndianRupee, Tag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Items() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthLoading && !token) {
      setLocation("/login");
    }
  }, [token, isAuthLoading, setLocation]);

  const { data: items = [], isLoading } = useListItems({
    query: { queryKey: getListItemsQueryKey(), enabled: !!token }
  });

  const { data: stats } = useGetItemStats({
    query: { queryKey: getGetItemStatsQueryKey(), enabled: !!token }
  });

  const deleteMutation = useDeleteItem();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Item deleted" });
          queryClient.invalidateQueries({ queryKey: getListItemsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetItemStatsQueryKey() });
        }
      });
    }
  };

  const getConditionColor = (cond?: string) => {
    switch(cond) {
      case "New": return "bg-green-500/10 text-green-600";
      case "Like New": return "bg-blue-500/10 text-blue-600";
      case "Good": return "bg-yellow-500/10 text-yellow-600";
      case "Fair": return "bg-orange-500/10 text-orange-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isAuthLoading || !user) return null;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Available Items</h1>
          <p className="text-muted-foreground mt-2">Find what you need from your seniors and peers.</p>
        </div>
        {stats && (
          <div className="flex gap-4">
            <div className="bg-card border rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Items</div>
            </div>
            <div className="bg-card border rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold text-primary">₹{Math.round(stats.avgPrice)}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg Price</div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 rounded-xl bg-card border animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-2xl">
          <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No items found</h3>
          <p className="text-muted-foreground">Be the first to list an item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="px-2 py-1 font-semibold">
                      {item.category}
                    </Badge>
                    {item.condition && (
                      <Badge variant="outline" className={`${getConditionColor(item.condition)} border-0`}>
                        {item.condition}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{item.name}</CardTitle>
                  <div className="text-3xl font-bold text-foreground flex items-center mt-2">
                    <IndianRupee className="w-6 h-6 mr-1" />
                    {item.price}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {item.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Listed by <span className="font-semibold text-foreground">{item.sellerName}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t gap-2">
                  <Button 
                    className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                    onClick={() => window.open(`https://wa.me/${item.sellerWhatsapp}?text=Hi ${item.sellerName}, I'm interested in your ${item.name} listed on CollegeMart.`, '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  {item.sellerId === user.id && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
