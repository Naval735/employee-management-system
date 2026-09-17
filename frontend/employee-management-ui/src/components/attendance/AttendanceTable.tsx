import React from 'react';
import { Attendance } from '../../types/attendance.types';
import { useAuth } from '../../context/AuthContext';

interface AttendanceTableProps {
  records: Attendance[];
  onEdit: (record: Attendance) => void;
  onDelete: (record: Attendance) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isHrOrAdmin = user?.role === 'Admin' || user?.role === 'HR';
  const isAdmin = user?.role === 'Admin';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <span className="badge bg-success px-2.5 py-1.5">Present</span>;
      case 'Absent':
        return <span className="badge bg-danger px-2.5 py-1.5">Absent</span>;
      case 'Leave':
        return <span className="badge bg-warning text-dark px-2.5 py-1.5">Leave</span>;
      case 'HalfDay':
        return <span className="badge bg-info text-dark px-2.5 py-1.5">Half Day</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (records.length === 0) {
    return (
      <div className="card border-0 shadow-sm text-center py-5">
        <div className="card-body">
          <i className="bi bi-calendar-x display-4 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-secondary">No Attendance Records</h5>
          <p className="text-muted mb-0">No attendance records matched the selected date or filter parameters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Status</th>
              <th>Remarks</th>
              <th className="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td className="fw-medium text-dark">{new Date(rec.date).toLocaleDateString()}</td>
                <td>
                  <div className="fw-semibold text-dark">{rec.employeeName}</div>
                  <small className="text-muted font-monospace">{rec.employeeCode}</small>
                </td>
                <td>
                  <span className="badge bg-light text-dark border">{rec.departmentName}</span>
                </td>
                <td>{getStatusBadge(rec.status)}</td>
                <td className="text-muted small">{rec.remarks || '-'}</td>
                <td className="text-end pe-4">
                  <div className="btn-group btn-group-sm">
                    {isHrOrAdmin && (
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        title="Edit Record"
                        onClick={() => onEdit(rec)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Delete Record"
                        onClick={() => onDelete(rec)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
