'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CustomTimePickerProps {
  value?: string; // "HH:MM" or "HH:MM:SS"
  onChange: (timeStr: string) => void;
  className?: string;
  placeholder?: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CustomTimePicker({
  value,
  onChange,
  className,
  placeholder = 'Pick a time',
}: CustomTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse current value
  const parsed = React.useMemo(() => {
    if (!value) return { hour: 8, minute: 0, period: 'AM' as 'AM' | 'PM' };
    const parts = value.split(':');
    let h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h = h - 12;
    return { hour: h, minute: m, period };
  }, [value]);

  const [hour, setHour] = React.useState(parsed.hour);
  const [minute, setMinute] = React.useState(parsed.minute);
  const [period, setPeriod] = React.useState<'AM' | 'PM'>(parsed.period);

  React.useEffect(() => {
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [value]);

  const handleApply = () => {
    let h24 = hour;
    if (period === 'AM' && hour === 12) h24 = 0;
    else if (period === 'PM' && hour !== 12) h24 = hour + 12;
    onChange(`${pad(h24)}:${pad(minute)}:00`);
    setOpen(false);
  };

  const displayValue = React.useMemo(() => {
    if (!value) return null;
    const parts = value.split(':');
    let h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    const p = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h = h - 12;
    return `${pad(h)}:${pad(m)} ${p}`;
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-3 py-2.5 h-auto text-sm shadow-sm transition-all focus:ring-2 focus:ring-emerald-400 focus:outline-none",
            !displayValue && "text-gray-500",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-emerald-500 flex-shrink-0" />
          {displayValue ? <span className="text-gray-800">{displayValue}</span> : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 z-50 rounded-xl border-gray-200 shadow-xl bg-white" align="start">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Time</p>

        <div className="flex items-center gap-2 mb-4">
          {/* Hour */}
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-medium mb-1 text-center">Hour</p>
            <div className="h-36 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 scrollbar-hide">
              {hours.map(h => (
                <button
                  key={h}
                  onClick={() => setHour(h)}
                  className={cn(
                    "w-full text-sm py-1.5 font-medium transition-colors",
                    hour === h
                      ? "bg-emerald-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {pad(h)}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xl font-bold text-gray-400 mt-4">:</span>

          {/* Minute */}
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-medium mb-1 text-center">Min</p>
            <div className="h-36 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 scrollbar-hide">
              {minutes.map(m => (
                <button
                  key={m}
                  onClick={() => setMinute(m)}
                  className={cn(
                    "w-full text-sm py-1.5 font-medium transition-colors",
                    minute === m
                      ? "bg-emerald-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {pad(m)}
                </button>
              ))}
            </div>
          </div>

          {/* AM/PM */}
          <div>
            <p className="text-[10px] text-gray-400 font-medium mb-1 text-center">AM/PM</p>
            <div className="flex flex-col gap-1">
              {(['AM', 'PM'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "w-12 py-2 rounded-lg text-xs font-bold transition-colors border",
                    period === p
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { onChange(''); setOpen(false); }}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
