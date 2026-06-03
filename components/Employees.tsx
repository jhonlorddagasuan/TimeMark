'use client';

import { useEffect, useState } from 'react';
import { Employee, CreateEmployeeInput } from '@/lib/types';
import { EmployeeCard } from '@/components/EmployeeCard';
import { EmployeeForm } from '@/components/EmployeeForm';
import { CustomSelect } from '@/components/CustomSelect';
import { Users, UserPlus, Search, Building2 } from 'lucide-react';

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'QA', 'DevOps', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Legal'];

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees');
      if (res.ok) setEmployees(await res.json());
    } catch (err) {
      console.error('[Employees] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateEmployeeInput) => {
    try {
      if (editingEmployee) {
        const res = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update');
        const updated = await res.json();
        setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
      } else {
        const res = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to create');
        }
        const created = await res.json();
        setEmployees(prev => [created, ...prev]);
      }
      setShowForm(false);
      setEditingEmployee(undefined);
    } catch (err: any) {
      alert(err.message || 'Error saving employee.');
    }
  };

  const handleToggleStatus = async (emp: Employee) => {
    const newStatus = emp.status === 'active' ? 'inactive' : 'active';
    if (!confirm(`${newStatus === 'inactive' ? 'Deactivate' : 'Activate'} ${emp.full_name}?`)) return;
    try {
      const res = await fetch(`/api/employees/${emp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
    } catch {
      alert('Failed to update employee status.');
    }
  };

  const filtered = employees.filter(e => {
    const matchSearch =
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.employee_code.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const activeCount = employees.filter(e => e.status === 'active').length;
  const depts = [...new Set(employees.map(e => e.department))];

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
              <p className="text-sm text-gray-400 mt-0.5">{activeCount} active · {employees.length} total</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingEmployee(undefined); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-emerald-200"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            />
          </div>
          <div className="relative">
            <CustomSelect
              value={deptFilter}
              onChange={setDeptFilter}
              options={[
                { value: 'All', label: 'All Departments' },
                ...depts.map(d => ({ value: d, label: d }))
              ]}
              placeholder="All Departments"
              icon={<Building2 className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-52 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded" />
                  <div className="h-2 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No employees found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(emp => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onEdit={e => { setEditingEmployee(e); setShowForm(true); }}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingEmployee(undefined); }}
        />
      )}
    </div>
  );
}
