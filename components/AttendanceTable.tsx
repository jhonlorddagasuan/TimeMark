'use client';

import { AttendanceRecord, AttendanceStatus } from '@/lib/types';
import { Clock, CheckCircle2, XCircle, AlertCircle, MinusCircle, Pencil, Trash2 } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  loading?: boolean;
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (id: number) => void;
  showEmployee?: boolean;
}

const statusConfig: Record<AttendanceStatus, { label: string; color: string; icon: any; bg: string }> = {
  present:  { label: 'Present',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  absent:   { label: 'Absent',   color: 'text-red-700',     bg: 'bg-red-50 border-red-200',         icon: XCircle },
  late:     { label: 'Late',     color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     icon: AlertCircle },
  'half-day': { label: 'Half Day', color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200',       icon: MinusCircle },
  holiday:  { label: 'Holiday',  color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200',   icon: Clock },
};

function formatTime(t?: string) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function getDurationInfo(clockIn?: string, clockOut?: string) {
  if (!clockIn || !clockOut) return { text: '—', status: 'none' };
  const [ih, im] = clockIn.split(':').map(Number);
  const [oh, om] = clockOut.split(':').map(Number);
  const mins = (oh * 60 + om) - (ih * 60 + im);
  if (mins <= 0) return { text: '—', status: 'none' };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  
  let status = 'regular';
  if (mins > 480) status = 'overtime';
  else if (mins < 480) status = 'undertime';
  
  return { text: `${h}h ${m}m`, status, mins };
}

export function AttendanceTable({ records, loading, onEdit, onDelete, showEmployee = true }: AttendanceTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-2 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No attendance records found</p>
        <p className="text-gray-400 text-sm mt-1">Records will appear here once attendance is marked</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {showEmployee && (
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
              )}
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clock In</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clock Out</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.map((rec) => {
              const s = statusConfig[rec.status] || statusConfig['present'];
              const StatusIcon = s.icon;
              return (
                <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                  {showEmployee && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(rec.employee_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{rec.employee_name || '—'}</p>
                          <p className="text-xs text-gray-400">{rec.employee_code} · {rec.department}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">{formatTime(rec.clock_in)}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">{formatTime(rec.clock_out)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {(() => {
                      const dur = getDurationInfo(rec.clock_in, rec.clock_out);
                      if (dur.status === 'none') return <span className="text-gray-400">—</span>;
                      return (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-medium text-gray-700">{dur.text}</span>
                          {dur.status === 'overtime' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 uppercase tracking-wide">
                              Overtime
                            </span>
                          )}
                          {dur.status === 'undertime' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wide">
                              Undertime
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {s.label}
                    </span>
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(rec)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(rec.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
