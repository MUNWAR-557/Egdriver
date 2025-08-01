
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function AnimatedSwitch({
  checked,
  onCheckedChange,
}: AnimatedSwitchProps) {
  const handleToggle = () => {
    onCheckedChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex h-8 w-28 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
        checked ? 'bg-green-500' : 'bg-gray-400'
      )}
    >
      <span
        className={cn(
          'absolute inset-0 flex items-center px-3 text-xs font-semibold text-white transition-opacity',
          checked ? 'justify-start opacity-100' : 'opacity-0'
        )}
      >
        Online
      </span>
      <span
        className={cn(
          'absolute inset-0 flex items-center px-3 text-xs font-semibold text-white transition-opacity',
          !checked ? 'justify-end opacity-100' : 'opacity-0'
        )}
      >
        Offline
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block h-7 w-14 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-14' : 'translate-x-0'
        )}
      />
    </button>
  );
}
