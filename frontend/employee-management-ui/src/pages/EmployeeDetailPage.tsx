import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Employee } from '../types/employee.types';
import { Attendance } from '../types/attendance.types';
import employeeService from '../services/employeeService';
import attendanceService from '../services/attendanceService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isHrOrAdmin = user?.role === 'Admin' || user?.role === 'HR';

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    Promise.all([
      employeeService.getEmployeeById(Number(id)),
      attendanceService.getAttendanceRecords({ employeeId: Number(id), pageSize: 5 }),
    ])
      .then(([empData, attData]) => {
        setEmployee(empData);
        setAttendances(attData.items);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load employee details.');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading employee profile..." />;
  }

  if (error || !employee) {
    return (
      <div>
        <ErrorMessage message={error || 'Employee record not found.'} />
        <Link to="/employees" className="btn btn-primary">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Link to="/employees" className="btn btn-outline-secondary me-3">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <div>
            <h2 className="fw-bold mb-0">{employee.fullName}</h2>
            <div className="text-muted">
              <span className="badge bg-primary-subtle text-primary me-2">{employee.employeeCode}</span>
              {employee.designation} • {employee.departmentName}
            </div>
          </div>
        </div>

        {isHrOrAdmin && (
          <Link to={`/employees/${employee.id}/edit`} className="btn btn-primary">
            <i className="bi bi-pencil me-1"></i> Edit Profile
          </Link>
        )}
      </div>

      <div className="row g-4">
        {/* Left Profile Overview Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4">
            <div
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mx-auto mb-3 fw-bold display-6"
              style={{ width: '96px', height: '96px' }}
            >
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <h4 className="fw-bold mb-1">{employee.fullName}</h4>
            <p className="text-muted mb-3">{employee.designation}</p>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6">
              {employee.employmentStatus}
            </span>

            <hr className="my-4" />

            <div className="text-start">
              <div className="mb-3">
                <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '11px' }}>
                  Email Address
                </small>
                <span className="text-dark fw-medium">{employee.email}</span>
              </div>
              <div className="mb-3">
                <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '11px' }}>
                  Phone Number
                </small>
                <span className="text-dark fw-medium">{employee.phone}</span>
              </div>
              <div className="mb-3">
                <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '11px' }}>
                  Joining Date
                </small>
                <span className="text-dark fw-medium">{new Date(employee.joiningDate).toLocaleDateString()}</span>
              </div>
              <div>
                <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '11px' }}>
                  Monthly Base Compensation
                </small>
                <span className="text-success fw-bold fs-5">${employee.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tabbed Details */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-primary">Personal & Address Details</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block small">Gender</span>
                  <span className="fw-semibold text-dark">{employee.gender}</span>
                </div>
                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block small">Date of Birth</span>
                  <span className="fw-semibold text-dark">{new Date(employee.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block small">Department Code</span>
                  <span className="badge bg-light text-dark border">{employee.departmentCode}</span>
                </div>
                <div className="col-12 col-sm-6">
                  <span className="text-muted d-block small">Department Name</span>
                  <span className="fw-semibold text-dark">{employee.departmentName}</span>
                </div>
                <div className="col-12">
                  <span className="text-muted d-block small">Residential Address</span>
                  <span className="fw-semibold text-dark">{employee.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-bold mb-0 text-primary">Recent Attendance Logs</h5>
              <Link to="/attendance" className="btn btn-sm btn-outline-primary">
                View All Logs
              </Link>
            </div>
            <div className="card-body p-0">
              {attendances.length === 0 ? (
                <div className="text-center py-4 text-muted">No recent attendance entries recorded.</div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((att) => (
                      <tr key={att.id}>
                        <td>{new Date(att.date).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              att.status === 'Present'
                                ? 'bg-success'
                                : att.status === 'Absent'
                                ? 'bg-danger'
                                : att.status === 'Leave'
                                ? 'bg-warning text-dark'
                                : 'bg-info'
                            }`}
                          >
                            {att.status}
                          </span>
                        </td>
                        <td className="text-muted small">{att.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
