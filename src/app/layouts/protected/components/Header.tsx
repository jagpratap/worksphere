import { ThemeToggle } from "@/components/common";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm font-medium text-muted-foreground">
          WorkSphere
        </span>
      </div>
      <ThemeToggle />
    </header>
  );
}
