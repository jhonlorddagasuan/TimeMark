'use client';

import { useState } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus, CreateAttendanceInput, UpdateAttendanceInput } from '@/lib/types';
import { X, Clock, User } from 'lucide-react';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomTimePicker } from '@/components/CustomTimePicker';
import { CustomSelect } from '@/components/CustomSelect';

interface AttendanceFormProps {
  record?: AttendanceRecord;
  employees?: Employee[];
  defaultDate?: string;
  onSubmit: (data: CreateAttendanceInput | UpdateAttendanceInput) => Promise<void>;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: 'present',  label: 'Present' },
  { value: 'absent',   label: 'Absent' },
  { value: 'late',     label: 'Late' },
  { value: 'half-day', label: 'Half Day' },
  { value: 'holiday',  label: 'Holiday' },
];

export function AttendanceForm({ record, employees = [], defaultDate, onSubmit, onCancel }: AttendanceFormProps) {
  const today = defaultDate || new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employee_id: record?.employee_id?.toString() || '',
    date: record?.date?.split('T')[0] || today,
    clock_in: record?.clock_in || '',
    clock_out: record?.clock_out || '',
    status: (record?.status || 'present') as AttendanceStatus,
    notes: record?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (record) {
        await onSubmit({
          clock_in: form.clock_in || undefined,
          clock_out: form.clock_out || undefined,
          status: form.status,
          notes: form.notes || undefined,
        } as UpdateAttendanceInput);
      } else {
        await onSubmit({
          employee_id: parseInt(form.employee_id),
          date: form.date,
          clock_in: form.clock_in || undefined,
          clock_out: form.clock_out || undefined,
          status: form.status,
          notes: form.notes || undefined,
        } as CreateAttendanceInput);
      }
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white";

  const employeeOptions = [
    { value: '', label: 'Select employee…' },
    ...employees.map(e => ({ value: String(e.id), label: `${e.full_name} (${e.employee_code})` })),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {record ? 'Edit Attendance' : 'Mark Attendance'}
              </h2>
              <p className="text-xs text-gray-400">
                {record ? `Editing record #${record.id}` : 'Record clock-in/out for employee'}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Employee (only for create) */}
          {!record && (
            <div>
              <label className={labelClass}>Employee *</label>
              <CustomSelect
                value={form.employee_id}
                onChange={(val) => setForm(prev => ({ ...prev, employee_id: val }))}
                options={employeeOptions}
                placeholder="Select employee…"
                icon={<User className="w-4 h-4" />}
              />
            </div>
          )}

          {/* Date (only for create) */}
          {!record && (
            <div>
              <label className={labelClass}>Date</label>
              <CustomDatePicker
                value={form.date}
                onChange={(val) => setForm({ ...form, date: val })}
                placeholder="Select date"
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className={labelClass}>Status *</label>
            <CustomSelect
              value={form.status}
              onChange={(val) => setForm(prev => ({ ...prev, status: val as AttendanceStatus }))}
              options={STATUS_OPTIONS}
              placeholder="Select status…"
            />
          </div>

          {/* Clock In / Out */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Clock In</label>
              <CustomTimePicker
                value={form.clock_in}
                onChange={(val) => setForm(prev => ({ ...prev, clock_in: val }))}
                placeholder="Set time"
              />
            </div>
            <div>
              <label className={labelClass}>Clock Out</label>
              <CustomTimePicker
                value={form.clock_out}
                onChange={(val) => setForm(prev => ({ ...prev, clock_out: val }))}
                placeholder="Set time"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              placeholder="Optional notes…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving…' : record ? 'Update' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
