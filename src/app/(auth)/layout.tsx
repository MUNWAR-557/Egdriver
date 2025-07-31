
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <span className="font-headline text-2xl font-bold text-primary">
              EGdriver
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
