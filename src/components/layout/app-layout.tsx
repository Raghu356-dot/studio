import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2.5 p-2">
              <Logo className="w-8 h-8 text-accent" />
              <span className="font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                SecureFlow
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {/* Navigation items can go here in the future */}
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
