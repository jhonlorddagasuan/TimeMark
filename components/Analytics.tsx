'use client';

import { useEffect, useState } from 'react';
import { Employee, Leave } from '@/lib/types';
import { Card } from '@/components/ui/card';
import {
  BarChart3, Users, TrendingUp, CalendarOff,
  CheckCircle2, XCircle, Clock, Building2,
} from 'lucide-react';

interface DeptStat { department: string; count: number; }
interface MonthStat { month: string; rate: number; present: number; total: number; }

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-700`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export function Analytics() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [monthStats, setMonthStats] = useState<MonthStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [empRes, leaveRes, attRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/leaves'),
        fetch('/api/attendance'),
      ]);
      const emps: Employee[] = empRes.ok ? await empRes.json() : [];
      const lvs: Leave[] = leaveRes.ok ? await leaveRes.json() : [];
      const atts: any[] = attRes.ok ? await attRes.json() : [];

      setEmployees(emps);
      setLeaves(lvs);

      // Build last-6-months attendance rate stats
      const now = new Date();
      const months: MonthStat[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const monthRecords = atts.filter(r => r.date?.startsWith(monthKey));
        const present = monthRecords.filter(r => ['present', 'late', 'half-day'].includes(r.status)).length;
        const total = monthRecords.length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        months.push({ month: monthLabel, rate, present, total });
      }
      setMonthStats(months);
    } catch (err) {
      console.error('[Analytics] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Department breakdown
  const deptMap: Record<string, number> = {};
  employees.forEach(e => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
  const deptStats: DeptStat[] = Object.entries(deptMap)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);
  const maxDept = Math.max(...deptStats.map(d => d.count), 1);

  // Leave stats
  const pending = leaves.filter(l => l.status === 'pending').length;
  const approved = leaves.filter(l => l.status === 'approved').length;
  const rejected = leaves.filter(l => l.status === 'rejected').length;

  // Employee status
  const activeEmps = employees.filter(e => e.status === 'active').length;
  const inactiveEmps = employees.filter(e => e.status === 'inactive').length;
  const onLeaveEmps = employees.filter(e => e.status === 'on-leave').length;

  const overallRate = monthStats.length > 0
    ? Math.round(monthStats.reduce((s, m) => s + m.rate, 0) / monthStats.filter(m => m.total > 0).length || 0)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-400 mt-0.5">Attendance insights and workforce metrics</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Employees', value: employees.length, icon: Users, color: 'text-slate-700', bg: 'bg-slate-50' },
            { label: 'Active Staff', value: activeEmps, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Avg Attendance Rate', value: `${overallRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Leaves', value: pending, icon: CalendarOff, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="p-5 border-0 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Attendance Rate */}
          <Card className="p-6 border-0 shadow-sm rounded-2xl">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Monthly Attendance Rate
            </h2>
            <div className="space-y-4">
              {monthStats.map(m => (
                <div key={m.month}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-600">{m.month}</span>
                    <span className="text-sm font-bold text-gray-900">{m.rate}%</span>
                  </div>
                  <ProgressBar
                    value={m.rate}
                    color={m.rate >= 80 ? 'bg-emerald-500' : m.rate >= 60 ? 'bg-amber-400' : 'bg-red-400'}
                  />
                  <p className="text-xs text-gray-400 mt-0.5">{m.present} present / {m.total} records</p>
                </div>
              ))}
              {monthStats.every(m => m.total === 0) && (
                <p className="text-gray-400 text-sm text-center py-4">No attendance data yet</p>
              )}
            </div>
          </Card>

          {/* Department Breakdown */}
          <Card className="p-6 border-0 shadow-sm rounded-2xl">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-violet-500" />
              Employees by Department
            </h2>
            <div className="space-y-4">
              {deptStats.map(d => (
                <div key={d.department}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-600">{d.department}</span>
                    <span className="text-sm font-bold text-gray-900">{d.count}</span>
                  </div>
                  <ProgressBar value={(d.count / maxDept) * 100} color="bg-violet-400" />
                </div>
              ))}
              {deptStats.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No employee data yet</p>
              )}
            </div>
          </Card>

          {/* Leave Statistics */}
          <Card className="p-6 border-0 shadow-sm rounded-2xl">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <CalendarOff className="w-4 h-4 text-amber-500" />
              Leave Requests
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Pending',  value: pending,  color: 'bg-amber-400',  text: 'text-amber-700' },
                { label: 'Approved', value: approved, color: 'bg-emerald-500', text: 'text-emerald-700' },
                { label: 'Rejected', value: rejected, color: 'bg-red-400',    text: 'text-red-700' },
              ].map(({ label, value, color, text }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-600">{label}</span>
                    <span className={`text-sm font-bold ${text}`}>{value}</span>
                  </div>
                  <ProgressBar value={leaves.length > 0 ? (value / leaves.length) * 100 : 0} color={color} />
                </div>
              ))}
              {leaves.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No leave requests yet</p>
              )}
            </div>
          </Card>

          {/* Workforce Status */}
          <Card className="p-6 border-0 shadow-sm rounded-2xl">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Workforce Status
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Active', value: activeEmps, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'On Leave', value: onLeaveEmps, icon: CalendarOff, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Inactive', value: inactiveEmps, icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
