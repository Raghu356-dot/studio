'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FlaskConical,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { CyberGuardLogo } from '@/components/icons';
import { Button } from '../ui/button';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analysis', label: 'Analysis Tools', icon: FlaskConical },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <CyberGuardLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">CyberGuard AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: 'Settings', side: 'right' }}>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: 'Help', side: 'right' }}>
                    <CircleHelp className="h-5 w-5" />
                    <span>Help</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
