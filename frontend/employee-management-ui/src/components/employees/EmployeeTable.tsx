import React from 'react';
import { Link } from 'react-router-dom';
import { Employee } from '../../types/employee.types';
import { useAuth } from '../../context/AuthContext';

interface EmployeeTableProps {
  employees: Employee[];
  selectedIds: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: number, checked: boolean) => void;
  onDeleteOne: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDeleteOne,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isHrOrAdmin = user?.role === 'Admin' || user?.role === 'HR';

  const allSelected = employees.length > 0 && employees.every((e) => selectedIds.includes(e.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FullTime':
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Full Time</span>;
      case 'PartTime':
        return <span className="badge bg-info-subtle text-info border border-info-subtle">Part Time</span>;
      case 'Contract':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Contract</span>;
      case 'Intern':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Intern</span>;
      case 'Terminated':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Terminated</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (employees.length === 0) {
    return (
      <div className="card border-0 shadow-sm text-center py-5">
        <div className="card-body">
          <i className="bi bi-people display-4 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-secondary">No Employees Found</h5>
          <p className="text-muted mb-3">No employee records matched your search parameters.</p>
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
              {isAdmin && (
                <th style={{ width: '40px' }} className="text-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                </th>
              )}
              <th>Employee</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Joining Date</th>
              <th className="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const isSelected = selectedIds.includes(emp.id);
              return (
                <tr key={emp.id} className={isSelected ? 'table-active' : ''}>
                  {isAdmin && (
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isSelected}
                        onChange={(e) => onSelectOne(emp.id, e.target.checked)}
                      />
                    </td>
                  )}
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0"
                        style={{ width: '40px', height: '40px', fontSize: '14px' }}
                      >
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <Link to={`/employees/${emp.id}`} className="fw-semibold text-dark text-decoration-none hover-primary">
                          {emp.fullName}
                        </Link>
                        <div className="small text-muted">
                          <span className="badge bg-light text-secondary border me-1">{emp.employeeCode}</span>
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fw-medium">{emp.departmentName}</span>
                  </td>
                  <td>{emp.designation}</td>
                  <td className="fw-semibold text-dark">${emp.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>{getStatusBadge(emp.employmentStatus)}</td>
                  <td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
                  <td className="text-end pe-4">
                    <div className="btn-group btn-group-sm">
                      <Link to={`/employees/${emp.id}`} className="btn btn-outline-secondary" title="View Details">
                        <i className="bi bi-eye"></i>
                      </Link>
                      {isHrOrAdmin && (
                        <Link to={`/employees/${emp.id}/edit`} className="btn btn-outline-primary" title="Edit">
                          <i className="bi bi-pencil"></i>
                        </Link>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          title="Delete"
                          onClick={() => onDeleteOne(emp)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
