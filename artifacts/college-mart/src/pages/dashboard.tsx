import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, PlusCircle, BookOpen, MessageSquare } from "lucide-react";

export default function Dashboard() {
  const { user, token, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !token) {
      setLocation("/login");
    }
  }, [token, isLoading, setLocation]);

  if (isLoading || !user) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  const actions = [
    { title: "Browse Items", desc: "Find cheap notes, drafters, and more", icon: Tag, href: "/items", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Sell an Item", desc: "Got stuff you don't need? List it here.", icon: PlusCircle, href: "/upload-item", color: "text-green-500", bg: "bg-green-500/10" },
    { title: "View Demands", desc: "See what other students are looking for", icon: BookOpen, href: "/demands", color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Post a Demand", desc: "Can't find it? Ask the community.", icon: MessageSquare, href: "/post-demand", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground">Hey, {user.name}!</h1>
        <p className="text-xl text-muted-foreground mt-2">Welcome to {user.college}'s marketplace.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={action.href}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.bg}`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{action.title}</CardTitle>
                  <CardDescription>{action.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
