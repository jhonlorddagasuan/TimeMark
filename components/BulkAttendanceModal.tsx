'use client';

import { useState } from 'react';
import { Employee, AttendanceStatus } from '@/lib/types';
import { X, Check } from 'lucide-react';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomTimePicker } from '@/components/CustomTimePicker';

interface BulkAttendanceModalProps {
  employees: Employee[];
  defaultDate?: string;
  onSubmit: (data: { employee_ids: number[], date: string, status: AttendanceStatus, clock_in?: string, clock_out?: string, notes?: string }) => Promise<void>;
  onCancel: () => void;
}

export function BulkAttendanceModal({ employees, defaultDate, onSubmit, onCancel }: BulkAttendanceModalProps) {
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [clockIn, setClockIn] = useState('09:00:00');
  const [clockOut, setClockOut] = useState('17:00:00');
  const [notes, setNotes] = useState('');
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const activeEmployees = employees.filter(e => e.status === 'active');

  const toggleAll = () => {
    if (selectedIds.length === activeEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(activeEmployees.map(e => e.id));
    }
  };

  const toggleEmployee = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return alert('Select at least one employee');
    
    setSaving(true);
    await onSubmit({
      employee_ids: selectedIds,
      date,
      status,
      clock_in: clockIn,
      clock_out: clockOut,
      notes
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Bulk Mark Attendance</h2>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-hidden flex-1">
          {/* Left Column: Form */}
          <div className="w-full md:w-1/3 border-r border-gray-100 p-6 overflow-y-auto bg-gray-50/50">
            <form id="bulk-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <CustomDatePicker
                  value={date}
                  onChange={setDate}
                  placeholder="Select date"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <CustomSelect
                  value={status}
                  onChange={(val) => setStatus(val as AttendanceStatus)}
                  options={[
                    { value: 'present', label: 'Present' },
                    { value: 'absent', label: 'Absent' },
                    { value: 'late', label: 'Late' },
                    { value: 'half-day', label: 'Half Day' },
                    { value: 'holiday', label: 'Holiday' },
                  ]}
                  placeholder="Select status…"
                />
              </div>

              {(status === 'present' || status === 'late' || status === 'half-day') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Clock In</label>
                    <CustomTimePicker
                      value={clockIn}
                      onChange={setClockIn}
                      placeholder="Set time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Clock Out</label>
                    <CustomTimePicker
                      value={clockOut}
                      onChange={setClockOut}
                      placeholder="Set time"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  placeholder="Applies to all selected..."
                />
              </div>
            </form>
          </div>

          {/* Right Column: Employee Selection */}
          <div className="w-full md:w-2/3 flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
              <span className="font-semibold text-gray-700">Select Employees</span>
              <button onClick={toggleAll} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                {selectedIds.length === activeEmployees.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeEmployees.map(emp => {
                const isSelected = selectedIds.includes(emp.id);
                return (
                  <div 
                    key={emp.id} 
                    onClick={() => toggleEmployee(emp.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex flex-shrink-0 items-center justify-center text-emerald-700 font-bold text-xs">
                      {emp.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{emp.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{emp.department}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            {selectedIds.length} employee{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="bulk-form"
              disabled={saving || selectedIds.length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Bulk Records'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
