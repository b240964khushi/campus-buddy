import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Book, Ruler, PenTool, Clipboard } from "lucide-react";

export default function Landing() {
  const { token } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (token) {
      setLocation("/dashboard");
    }
  }, [token, setLocation]);

  const floatingIcons = [
    { Icon: Book, delay: 0, x: -100, y: -50 },
    { Icon: Ruler, delay: 0.2, x: 150, y: 80 },
    { Icon: PenTool, delay: 0.4, x: -120, y: 120 },
    { Icon: Clipboard, delay: 0.6, x: 100, y: -100 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 text-primary"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: item.x,
              y: item.y,
            }}
            transition={{ 
              duration: 1, 
              delay: item.delay,
              type: "spring",
              bounce: 0.5
            }}
          >
            <item.Icon size={64} />
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-wide uppercase">
            The Campus Marketplace
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-6">
            College<span className="text-primary">Mart</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
            Pass on your drafters. Grab cheap notes. Trade your lab coat. 
            The digital noticeboard for everything you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full hover:bg-muted/50">
                Log In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
