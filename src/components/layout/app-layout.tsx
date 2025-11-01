"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { LayoutDashboard } from "lucide-react";
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2.5 p-2">
              <Logo className="w-8 h-8 text-accent" />
              <span className="font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Analysis Tools">
                  <a href="/">
                    <LayoutDashboard />
                    <span>Analysis Tools</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
