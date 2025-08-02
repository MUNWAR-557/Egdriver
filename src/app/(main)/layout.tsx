
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChartBig,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Settings,
  UserCircle,
  Zap,
} from 'lucide-react';

function MainLayoutContent({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const pathname = usePathname();
    const { setOpenMobile, isMobile } = useSidebar();
  
    React.useEffect(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [pathname, isMobile, setOpenMobile]);
  
    const menuItems = [
      { href: '/dashboard', label: 'Dashboard', icon: BarChartBig },
      { href: '/orders', label: 'Orders', icon: LayoutGrid },
      { href: '/profile', label: 'Profile', icon: UserCircle },
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: '/support', label: 'Support', icon: LifeBuoy },
    ];
  
    return (
        <div className="flex min-h-screen ">
          <Sidebar collapsible="icon" className="border-r border-sidebar-border">
            <SidebarHeader className="p-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="font-headline text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  EGdriver
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{
                        children: item.label,
                        side: 'right',
                        align: 'center',
                      }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={{
                        children: "Sign Out",
                        side: 'right',
                        align: 'center',
                      }}
                    >
                      <Link href="/login">
                        <LogOut />
                        <span>Sign Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Driver" data-ai-hint="driver avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold text-sidebar-foreground">
                    John Doe
                  </span>
                  <span className="text-xs text-sidebar-foreground/70">
                    john.doe@example.com
                  </span>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="bg-background">
            <header className="sticky top-0 z-10 border-b bg-background">
              <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
                <SidebarTrigger className="md:hidden bg-green-500 text-white hover:bg-green-600" />
                <div className="flex-1 md:hidden">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="font-headline text-xl font-bold text-primary">
                      EGdriver
                    </span>
                  </Link>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
          </SidebarInset>
        </div>
    );
}

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <SidebarProvider>
            <MainLayoutContent>{children}</MainLayoutContent>
        </SidebarProvider>
    )
}
