'use client';

import { useEffect, useState } from 'react';
import { AttendanceRecord, Employee, TodayStats, CreateAttendanceInput, UpdateAttendanceInput } from '@/lib/types';
import { StatsCards } from '@/components/StatsCards';
import { AttendanceTable } from '@/components/AttendanceTable';
import { AttendanceForm } from '@/components/AttendanceForm';
import { CalendarDays, Plus, RefreshCw } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState<TodayStats & { half_day?: number; on_leave?: number } | null>(null);
  const [summaryStats, setSummaryStats] = useState<TodayStats & { half_day?: number; on_leave?: number } | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | undefined>();

  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const fetchAll = async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      const [statsRes, recordsRes, empRes, summaryRes] = await Promise.all([
        fetch('/api/attendance/today'),
        fetch(`/api/attendance?date=${today}`),
        fetch('/api/employees?status=active'),
        fetch('/api/attendance/summary?startDate=2026-05-01&endDate=2026-06-30'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (recordsRes.ok) setRecords(await recordsRes.json());
      if (empRes.ok) setEmployees(await empRes.json());
      if (summaryRes.ok) setSummaryStats(await summaryRes.json());
    } catch (err) {
      console.error('[Dashboard] fetch error:', err);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (data: CreateAttendanceInput | UpdateAttendanceInput) => {
    try {
      if (editingRecord) {
        const res = await fetch(`/api/attendance/${editingRecord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
      } else {
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setRecords(prev => {
          const idx = prev.findIndex(r => r.id === created.id);
          return idx >= 0 ? prev.map(r => r.id === created.id ? created : r) : [created, ...prev];
        });
      }
      // Refresh stats
      const sr = await fetch('/api/attendance/today');
      if (sr.ok) setStats(await sr.json());
      setShowForm(false);
      setEditingRecord(undefined);
    } catch {
      alert('Failed to save attendance record. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this attendance record?')) return;
    try {
      await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
      setRecords(prev => prev.filter(r => r.id !== id));
      const sr = await fetch('/api/attendance/today');
      if (sr.ok) setStats(await sr.json());
    } catch {
      alert('Failed to delete record.');
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Today</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">{todayFormatted}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setEditingRecord(undefined); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-emerald-200"
            >
              <Plus className="w-4 h-4" />
              Mark Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        
        {/* Summary Stats (May-June) */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Overall Summary (May 1 - June 30)</h2>
          <StatsCards stats={summaryStats ?? { total_employees: 0, present: 0, absent: 0, late: 0, on_leave: 0, attendance_rate: 0 }} loading={statsLoading} isSummary />
        </div>

        {/* Today's Stats */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Today's Overview</h2>
          <StatsCards stats={stats ?? { total_employees: 0, present: 0, absent: 0, late: 0, on_leave: 0, attendance_rate: 0 }} loading={statsLoading} />
        </div>

        {/* Today's Attendance Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">Today's Attendance</h2>
            <span className="text-xs text-gray-400">{records.length} record{records.length !== 1 ? 's' : ''}</span>
          </div>
          <AttendanceTable
            records={records}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showEmployee
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <AttendanceForm
          record={editingRecord}
          employees={employees}
          defaultDate={today}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingRecord(undefined); }}
        />
      )}
    </div>
  );
}
