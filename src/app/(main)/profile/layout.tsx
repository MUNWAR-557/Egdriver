
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  UserCircle,
  Car,
  FileText,
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/profile/personal', label: 'Personal', icon: UserCircle },
    { href: '/profile/official',label: 'Official', icon: FileText },
    { href: '/profile/vehicle', label: 'Vehicle', icon: Car },
    { href: '/profile/payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
       <ScrollArea className="w-full whitespace-nowrap border-b">
        <nav className="flex w-max items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
            {menuItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={`flex items-center shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href || (item.href === '/profile/personal' && pathname === '/profile')
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
            >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
            </Link>
            ))}
        </nav>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div>{children}</div>
    </div>
  );
}
