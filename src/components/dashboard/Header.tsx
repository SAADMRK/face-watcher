import { Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="glass-card mb-8">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VisionGuard</h1>
            <p className="text-sm text-muted-foreground">Système de détection intelligente</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full animate-pulse-subtle" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
