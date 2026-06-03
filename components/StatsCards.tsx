'use client';

import { TodayStats } from '@/lib/types';
import { Users, UserCheck, UserX, Clock, TrendingUp, CalendarOff } from 'lucide-react';

interface StatsCardsProps {
  stats: TodayStats & { half_day?: number; on_leave?: number };
  loading?: boolean;
  isSummary?: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('-700', '-50').replace('-600', '-50').replace('-500', '-50')}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ stats, loading, isSummary = false }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-28 animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        icon={Users}
        label="Total Employees"
        value={stats.total_employees}
        color="text-slate-700"
        sub="Active staff"
      />
      <StatCard
        icon={UserCheck}
        label="Present"
        value={stats.present}
        color="text-emerald-600"
        sub={isSummary ? "Total on time" : "On time today"}
      />
      <StatCard
        icon={UserX}
        label="Absent"
        value={stats.absent}
        color="text-red-500"
        sub={isSummary ? "Total absences" : "Not checked in"}
      />
      <StatCard
        icon={Clock}
        label="Late"
        value={stats.late}
        color="text-amber-500"
        sub={isSummary ? "Total late" : "After schedule"}
      />
      <StatCard
        icon={CalendarOff}
        label="On Leave"
        value={stats.on_leave ?? 0}
        color="text-violet-500"
        sub={isSummary ? "Total leaves taken" : "Approved leaves"}
      />
      <StatCard
        icon={TrendingUp}
        label="Attendance Rate"
        value={`${stats.attendance_rate}%`}
        color="text-blue-600"
        sub={isSummary ? "Average rate" : "Today's rate"}
      />
    </div>
  );
}
