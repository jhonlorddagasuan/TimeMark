'use client';

import * as React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CustomDatePickerProps {
  value?: string;
  onChange: (dateStr: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export function CustomDatePicker({
  value,
  onChange,
  className,
  placeholder = 'Pick a date',
}: CustomDatePickerProps) {
  // Try to safely parse the 'YYYY-MM-DD' string to a Date object without timezone shifting issues.
  let dateValue: Date | undefined = undefined;
  if (value && value.trim() !== '') {
    // split the string to avoid timezone shifts
    const parts = value.split('-');
    if (parts.length === 3) {
      dateValue = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
  }
  
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Create local YYYY-MM-DD string without timezone shifting
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-3 py-2.5 h-auto text-sm shadow-sm transition-all focus:ring-2 focus:ring-emerald-400 focus:outline-none",
            !dateValue && "text-gray-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500 flex-shrink-0" />
          {dateValue ? format(dateValue, "MMMM d, yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 rounded-xl border-gray-200 shadow-xl overflow-hidden" align="start">
        <div className="bg-white p-2">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            initialFocus
            className="rounded-lg border-0 bg-white"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
