
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

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/profile/personal', label: 'Personal Information', icon: UserCircle },
    { href: '/profile/official', label: 'Official Information', icon: FileText },
    { href: '/profile/vehicle', label: 'Vehicle Details', icon: Car },
    { href: '/profile/payment', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <nav className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="md:col-span-3">{children}</div>
    </div>
  );
}
