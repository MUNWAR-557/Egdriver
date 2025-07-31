
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
import { Separator } from '@/components/ui/separator';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/profile/personal', label: 'Personal Information', icon: UserCircle },
    { href: '/profile/official',label: 'Official Information', icon: FileText },
    { href: '/profile/vehicle', label: 'Vehicle Details', icon: Car },
    { href: '/profile/payment', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center space-x-2 md:space-x-4 lg:space-x-6 border-b">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-t-md transition-colors ${
              pathname === item.href
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
