'use client';

import { useState } from 'react';
import { Employee, CreateLeaveInput, LeaveType } from '@/lib/types';
import { X } from 'lucide-react';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomSelect } from '@/components/CustomSelect';

interface LeaveFormProps {
  employees: Employee[];
  onSubmit: (data: CreateLeaveInput) => Promise<void>;
  onCancel: () => void;
}

export function LeaveForm({ employees, onSubmit, onCancel }: LeaveFormProps) {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || 0);
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({
      employee_id: employeeId,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Request Leave</h2>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employee</label>
              <CustomSelect
                value={String(employeeId)}
                onChange={(val) => setEmployeeId(parseInt(val))}
                options={employees.map(e => ({ value: String(e.id), label: `${e.full_name} (${e.department})` }))}
                placeholder="Select employee…"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Leave Type</label>
              <CustomSelect
                value={leaveType}
                onChange={(val) => setLeaveType(val as LeaveType)}
                options={[
                  { value: 'annual', label: 'Annual Leave' },
                  { value: 'sick', label: 'Sick Leave' },
                  { value: 'unpaid', label: 'Unpaid Leave' },
                  { value: 'maternity', label: 'Maternity Leave' },
                  { value: 'paternity', label: 'Paternity Leave' },
                  { value: 'emergency', label: 'Emergency Leave' },
                ]}
                placeholder="Select type…"
              />
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
              <CustomDatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
              <CustomDatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Select end date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason (Optional)</label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              placeholder="Provide a brief reason..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50 transition-colors"
            >
              {saving ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
