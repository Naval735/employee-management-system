import React, { useState, useEffect } from 'react';
import { Employee } from '../../types/employee.types';
import { Attendance, AttendanceStatusType, CreateAttendancePayload } from '../../types/attendance.types';
import ErrorMessage from '../common/ErrorMessage';

interface MarkAttendanceModalProps {
  show: boolean;
  employees: Employee[];
  editingRecord: Attendance | null;
  isSubmitting: boolean;
  onSave: (payload: CreateAttendancePayload, isEditMode: boolean) => Promise<void>;
  onClose: () => void;
}

export const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  show,
  employees,
  editingRecord,
  isSubmitting,
  onSave,
  onClose,
}) => {
  const isEditMode = !!editingRecord;

  const [employeeId, setEmployeeId] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AttendanceStatusType>('Present');
  const [remarks, setRemarks] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRecord) {
      setEmployeeId(editingRecord.employeeId);
      setDate(editingRecord.date ? editingRecord.date.split('T')[0] : '');
      setStatus(editingRecord.status);
      setRemarks(editingRecord.remarks || '');
    } else {
      if (employees.length > 0) setEmployeeId(employees[0].id);
      setDate(new Date().toISOString().split('T')[0]);
      setStatus('Present');
      setRemarks('');
    }
    setError(null);
  }, [editingRecord, employees]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId === 0) {
      setError('Please select an employee.');
      return;
    }

    try {
      await onSave({ employeeId, date, status, remarks }, isEditMode);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to record attendance.');
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">
              {isEditMode ? 'Update Attendance Record' : 'Mark Daily Attendance'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />

              <div className="mb-3">
                <label className="form-label fw-semibold">Employee *</label>
                <select
                  className="form-select"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(Number(e.target.value))}
                  disabled={isEditMode}
                  required
                >
                  <option value={0}>Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeCode}) - {emp.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isEditMode}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Attendance Status *</label>
                <div className="row g-2">
                  {(['Present', 'Absent', 'Leave', 'HalfDay'] as AttendanceStatusType[]).map((st) => (
                    <div key={st} className="col-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="statusOptions"
                        id={`status-${st}`}
                        value={st}
                        checked={status === st}
                        onChange={() => setStatus(st)}
                      />
                      <label
                        className={`btn w-100 py-2 border ${
                          status === st
                            ? st === 'Present'
                              ? 'btn-success'
                              : st === 'Absent'
                              ? 'btn-danger'
                              : st === 'Leave'
                              ? 'btn-warning text-dark'
                              : 'btn-info'
                            : 'btn-outline-secondary'
                        }`}
                        htmlFor={`status-${st}`}
                      >
                        {st === 'HalfDay' ? 'Half Day' : st}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Remarks / Notes</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. On time, Medical leave, Approved casual leave"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Record' : 'Submit Attendance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
