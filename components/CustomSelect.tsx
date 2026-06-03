'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className,
  icon,
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400",
            !selectedLabel && "text-gray-400",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {icon && <span className="flex-shrink-0 text-emerald-500">{icon}</span>}
            <span className={selectedLabel ? "text-gray-800 font-medium" : "text-gray-400"}>
              {selectedLabel || placeholder}
            </span>
          </span>
          <ChevronDown className={cn("w-4 h-4 text-gray-400 flex-shrink-0 transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-1.5 z-50 rounded-xl border-gray-200 shadow-xl bg-white min-w-[var(--radix-popover-trigger-width)]"
        align="start"
        sideOffset={4}
      >
        <div className="max-h-60 overflow-y-auto scrollbar-hide">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                option.value === value
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 font-medium"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
