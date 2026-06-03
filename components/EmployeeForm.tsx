'use client';

import { useState } from 'react';
import { Employee, CreateEmployeeInput, EmployeeStatus } from '@/lib/types';
import { X, UserPlus } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: CreateEmployeeInput) => Promise<void>;
  onCancel: () => void;
}

const DEPARTMENTS = ['Engineering', 'Design', 'QA', 'DevOps', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Legal'];

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employee_code: employee?.employee_code || '',
    full_name: employee?.full_name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    department: employee?.department || '',
    position: employee?.position || '',
    status: (employee?.status || 'active') as EmployeeStatus,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
              <p className="text-xs text-gray-400">{employee ? `Editing ${employee.full_name}` : 'Fill in employee details below'}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code + Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Employee Code *</label>
              <input
                type="text"
                name="employee_code"
                value={form.employee_code}
                onChange={handleChange}
                required
                placeholder="EMP001"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="john@company.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1-555-0100"
                className={inputClass}
              />
            </div>
          </div>

          {/* Department + Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Department *</label>
              <CustomSelect
                value={form.department}
                onChange={(val) => setForm(prev => ({ ...prev, department: val }))}
                options={[
                  { value: '', label: 'Select department…' },
                  ...DEPARTMENTS.map(d => ({ value: d, label: d }))
                ]}
                placeholder="Select department…"
              />
            </div>
            <div>
              <label className={labelClass}>Position *</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                placeholder="Senior Developer"
                className={inputClass}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <CustomSelect
              value={form.status}
              onChange={(val) => setForm(prev => ({ ...prev, status: val as EmployeeStatus }))}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'on-leave', label: 'On Leave' },
              ]}
              placeholder="Select status…"
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
              {loading ? 'Saving…' : employee ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
