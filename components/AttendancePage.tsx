'use client';

import { useEffect, useState } from 'react';
import { AttendanceRecord, Employee, AttendanceStatus, CreateAttendanceInput, UpdateAttendanceInput } from '@/lib/types';
import { AttendanceTable } from '@/components/AttendanceTable';
import { AttendanceForm } from '@/components/AttendanceForm';
import { BulkAttendanceModal } from '@/components/BulkAttendanceModal';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomSelect } from '@/components/CustomSelect';
import { CalendarRange, Plus, Search, Filter, Download, RotateCcw, Users } from 'lucide-react';

export function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | undefined>();

  // Filter States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [empFilter, setEmpFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      if (res.ok) setEmployees(await res.json());
    } catch (err) {
      console.error('[AttendancePage] failed to fetch employees:', err);
    }
  };

  const fetchRecords = async (filters?: { dateFrom?: string; dateTo?: string; status?: string; employee_id?: string; department?: string }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters?.dateTo) params.append('date_to', filters.dateTo);
      if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters?.employee_id && filters.employee_id !== 'All') params.append('employee_id', filters.employee_id);
      if (filters?.department && filters.department !== 'All') params.append('department', filters.department);

      const res = await fetch(`/api/attendance?${params.toString()}`);
      if (res.ok) setRecords(await res.json());
    } catch (err) {
      console.error('[AttendancePage] failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRecords({ dateFrom, dateTo, status: statusFilter, employee_id: empFilter, department: deptFilter });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords({ dateFrom, dateTo, status: statusFilter, employee_id: empFilter, department: deptFilter });
  };

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    setStatusFilter('All');
    setEmpFilter('All');
    setDeptFilter('All');
    fetchRecords({ dateFrom: '', dateTo: '', status: 'All', employee_id: 'All', department: 'All' });
  };

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
        await fetchRecords({ dateFrom, dateTo, status: statusFilter, employee_id: empFilter, department: deptFilter });
      }
      setShowForm(false);
      setEditingRecord(undefined);
    } catch {
      alert('Failed to save attendance record.');
    }
  };

  const handleBulkSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchRecords({ dateFrom, dateTo, status: statusFilter, employee_id: empFilter, department: deptFilter });
      setShowBulkForm(false);
    } catch {
      alert('Failed to save bulk records.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Failed to delete attendance record.');
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleExportCSV = () => {
    if (records.length === 0) return alert('No records to export');
    
    const headers = ['Record ID', 'Employee Name', 'Employee Code', 'Department', 'Date', 'Clock In', 'Clock Out', 'Status', 'Notes'];
    const rows = records.map(r => [
      r.id,
      r.employee_name || '',
      r.employee_code || '',
      r.department || '',
      r.date.split('T')[0],
      r.clock_in || '',
      r.clock_out || '',
      r.status,
      r.notes || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CalendarRange className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Attendance Logs</h1>
              <p className="text-sm text-gray-400 mt-0.5">Filter, view, and export attendance records</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => { setShowBulkForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-200"
            >
              <Users className="w-4 h-4" />
              Bulk Mark
            </button>
            <button
              onClick={() => { setEditingRecord(undefined); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-emerald-200"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Department</label>
              <CustomSelect
                value={deptFilter}
                onChange={setDeptFilter}
                options={[
                  { value: 'All', label: 'All Departments' },
                  ...Array.from(new Set(employees.map(e => e.department))).map(dept => ({ value: dept, label: dept }))
                ]}
                placeholder="All Departments"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Employee</label>
              <CustomSelect
                value={empFilter}
                onChange={setEmpFilter}
                options={[
                  { value: 'All', label: 'All Employees' },
                  ...employees.map(e => ({ value: String(e.id), label: e.full_name }))
                ]}
                placeholder="All Employees"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'late', label: 'Late' },
                  { value: 'half-day', label: 'Half Day' },
                  { value: 'holiday', label: 'Holiday' },
                ]}
                placeholder="All Statuses"
              />
            </div>

              <div className="md:col-span-2 relative z-20">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">From Date</label>
                <CustomDatePicker
                  value={dateFrom}
                  onChange={setDateFrom}
                  placeholder="Select date"
                />
              </div>
              <div className="md:col-span-2 relative z-10">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">To Date</label>
                <CustomDatePicker
                  value={dateTo}
                  onChange={setDateTo}
                  placeholder="Select date"
                />
              </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Main Logs Table */}
        <AttendanceTable
          records={records}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showEmployee={true}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <AttendanceForm
          record={editingRecord}
          employees={employees}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingRecord(undefined); }}
        />
      )}

      {/* Bulk Form Modal */}
      {showBulkForm && (
        <BulkAttendanceModal
          employees={employees}
          onSubmit={handleBulkSubmit}
          onCancel={() => setShowBulkForm(false)}
        />
      )}
    </div>
  );
}
