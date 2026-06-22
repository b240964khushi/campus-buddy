import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { useListDemands, getListDemandsQueryKey, useDeleteDemand } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Trash2, BookOpen } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Demands() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthLoading && !token) {
      setLocation("/login");
    }
  }, [token, isAuthLoading, setLocation]);

  const { data: demands = [], isLoading } = useListDemands({
    query: { queryKey: getListDemandsQueryKey(), enabled: !!token }
  });

  const deleteMutation = useDeleteDemand();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this demand?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Demand deleted" });
          queryClient.invalidateQueries({ queryKey: getListDemandsQueryKey() });
        }
      });
    }
  };

  if (isAuthLoading || !user) return null;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Community Demands</h1>
        <p className="text-muted-foreground mt-2">Help out your peers if you have what they need.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-48 rounded-xl bg-card border animate-pulse" />
          ))}
        </div>
      ) : demands.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-2xl">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No demands right now</h3>
          <p className="text-muted-foreground">Everyone has everything they need!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demands.map((demand, i) => (
            <motion.div
              key={demand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
            >
              <Card className="h-full flex flex-col border-dashed border-2 hover:border-primary/30 transition-colors bg-card/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Looking For</Badge>
                    {demand.budget ? (
                      <Badge variant="secondary" className="font-mono">Budget: ₹{demand.budget}</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">Price Negotiable</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{demand.itemName}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {demand.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Posted by <span className="font-semibold text-foreground">{demand.posterName}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t gap-2">
                  <Button 
                    className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                    onClick={() => window.open(`https://wa.me/${demand.posterWhatsapp}?text=Hi ${demand.posterName}, I saw your demand for ${demand.itemName} on CollegeMart. I have it!`, '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    I have this!
                  </Button>
                  {demand.posterId === user.id && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(demand.id)}
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
