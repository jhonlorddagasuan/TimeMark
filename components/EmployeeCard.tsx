'use client';

import { Employee, EmployeeStatus } from '@/lib/types';
import { Mail, Phone, Building2, Briefcase, MoreVertical, Edit, UserX, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (emp: Employee) => void;
  onToggleStatus?: (emp: Employee) => void;
}

const statusConfig: Record<EmployeeStatus, { label: string; color: string; bg: string }> = {
  active:    { label: 'Active',    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  inactive:  { label: 'Inactive',  color: 'text-gray-500',    bg: 'bg-gray-50 border-gray-200' },
  'on-leave':{ label: 'On Leave',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
};

const avatarColors = [
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-orange-400 to-amber-500',
  'from-cyan-400 to-sky-500',
];

export function EmployeeCard({ employee, onEdit, onToggleStatus }: EmployeeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const s = statusConfig[employee.status] || statusConfig['active'];
  const colorIdx = employee.id % avatarColors.length;
  const gradColor = avatarColors[colorIdx];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 relative group">
      {/* Actions Menu */}
      {(onEdit || onToggleStatus) && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-40">
                {onEdit && (
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(employee); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-500" /> Edit
                  </button>
                )}
                {onToggleStatus && (
                  <button
                    onClick={() => { setMenuOpen(false); onToggleStatus(employee); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {employee.status === 'active'
                      ? <><UserX className="w-4 h-4 text-red-500" /> Deactivate</>
                      : <><UserCheck className="w-4 h-4 text-emerald-500" /> Activate</>
                    }
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Avatar + Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
          {employee.avatar_initials || employee.full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-bold text-gray-900 text-sm truncate">{employee.full_name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{employee.employee_code}</p>
          <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.color}`}>
            {s.label}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Briefcase className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          <span className="truncate">{employee.position}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Building2 className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          <span className="truncate">{employee.department}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          <span className="truncate">{employee.email}</span>
        </div>
        {employee.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Phone className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            <span>{employee.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
