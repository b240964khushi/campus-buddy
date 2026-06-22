import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, Tag, PlusCircle, MessageSquare } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/items", label: "Available Items", icon: Tag },
    { href: "/upload-item", label: "Upload Item", icon: PlusCircle },
    { href: "/demands", label: "All Demands", icon: BookOpen },
    { href: "/post-demand", label: "Post Demand", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-primary tracking-tight">
            CollegeMart
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col items-end mr-4">
                <span className="text-sm font-bold">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.college}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => logout()}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
