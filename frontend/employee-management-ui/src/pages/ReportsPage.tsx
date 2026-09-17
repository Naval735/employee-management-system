import React, { useState, useEffect, useCallback } from 'react';
import { Employee } from '../types/employee.types';
import { Attendance } from '../types/attendance.types';
import { DepartmentReportItem, SalaryReportItem } from '../types/report.types';
import reportService from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

type ReportTab = 'employees' | 'departments' | 'attendance' | 'salary';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('employees');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<DepartmentReportItem[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryReportItem[]>([]);

  // Attendance Date Range Filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActiveReportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'employees') {
        const data = await reportService.getEmployeeDirectory();
        setEmployees(data);
      } else if (activeTab === 'departments') {
        const data = await reportService.getDepartmentReport();
        setDepartments(data);
      } else if (activeTab === 'attendance') {
        const data = await reportService.getAttendanceReport(startDate || undefined, endDate || undefined);
        setAttendance(data);
      } else if (activeTab === 'salary') {
        const data = await reportService.getSalaryReport();
        setSalaryData(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load report data.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, startDate, endDate]);

  useEffect(() => {
    loadActiveReportData();
  }, [loadActiveReportData]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const endpoint =
        activeTab === 'employees'
          ? '/reports/employees/excel'
          : activeTab === 'departments'
          ? '/reports/departments/excel'
          : activeTab === 'attendance'
          ? `/reports/attendance/excel${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`
          : '/reports/salary/excel';

      await reportService.downloadFile(endpoint, `${activeTab}_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      setError('Failed to download Excel report.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const endpoint =
        activeTab === 'employees'
          ? '/reports/employees/pdf'
          : activeTab === 'departments'
          ? '/reports/departments/pdf'
          : activeTab === 'attendance'
          ? `/reports/attendance/pdf${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`
          : '/reports/salary/pdf';

      await reportService.downloadFile(endpoint, `${activeTab}_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      setError('Failed to download PDF report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Report Center & Data Export</h2>
          <p className="text-muted mb-0">Generate, preview, and download official PDF and Excel reports</p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-success d-flex align-items-center fw-semibold shadow-sm"
            onClick={handleExportExcel}
            disabled={isExporting || isLoading}
          >
            <i className="bi bi-file-earmark-excel-fill me-2 fs-5"></i> Download Excel
          </button>

          <button
            type="button"
            className="btn btn-outline-danger d-flex align-items-center fw-semibold shadow-sm"
            onClick={handleExportPdf}
            disabled={isExporting || isLoading}
          >
            <i className="bi bi-file-earmark-pdf-fill me-2 fs-5"></i> Download PDF
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {/* Tabs Header */}
      <ul className="nav nav-tabs nav-fill bg-white rounded-top shadow-sm border-0 mb-0">
        <li className="nav-item">
          <button
            className={`nav-link py-3 fw-semibold ${activeTab === 'employees' ? 'active text-primary border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('employees')}
          >
            <i className="bi bi-people me-2"></i> Employee Directory
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link py-3 fw-semibold ${activeTab === 'departments' ? 'active text-primary border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('departments')}
          >
            <i className="bi bi-building me-2"></i> Department Breakdown
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link py-3 fw-semibold ${activeTab === 'attendance' ? 'active text-primary border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('attendance')}
          >
            <i className="bi bi-calendar-check me-2"></i> Attendance Log Report
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link py-3 fw-semibold ${activeTab === 'salary' ? 'active text-primary border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('salary')}
          >
            <i className="bi bi-cash-stack me-2"></i> Salary & Payroll Report
          </button>
        </li>
      </ul>

      {/* Attendance Date Range Filter Bar (Only shown on Attendance Tab) */}
      {activeTab === 'attendance' && (
        <div className="bg-light p-3 border-start border-end d-flex flex-column flex-sm-row align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-semibold">From:</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-semibold">To:</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Tab Content Preview Container */}
      <div className="card border-0 shadow-sm rounded-bottom rounded-0 overflow-hidden mb-4">
        <div className="card-body p-0">
          {isLoading ? (
            <LoadingSpinner message="Generating report preview..." />
          ) : activeTab === 'employees' ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="font-monospace fw-semibold">{emp.employeeCode}</td>
                      <td className="fw-bold">{emp.fullName}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.departmentName}</td>
                      <td>{emp.designation}</td>
                      <td className="fw-semibold">${emp.salary.toLocaleString()}</td>
                      <td>
                        <span className="badge bg-success-subtle text-success">{emp.employmentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'departments' ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Department Name</th>
                    <th>Employee Count</th>
                    <th>Total Monthly Payroll</th>
                    <th>Average Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.departmentId}>
                      <td className="font-monospace fw-semibold">{dept.code}</td>
                      <td className="fw-bold">{dept.name}</td>
                      <td>
                        <span className="badge bg-primary px-2.5 py-1.5">{dept.employeeCount} Employees</span>
                      </td>
                      <td className="fw-bold text-success">${dept.totalSalaryExpense.toLocaleString()}</td>
                      <td className="fw-semibold">${dept.averageSalary.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'attendance' ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Employee Code</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No attendance records found for this period.
                      </td>
                    </tr>
                  ) : (
                    attendance.map((att) => (
                      <tr key={att.id}>
                        <td className="fw-medium">{new Date(att.date).toLocaleDateString()}</td>
                        <td className="font-monospace">{att.employeeCode}</td>
                        <td className="fw-semibold">{att.employeeName}</td>
                        <td>{att.departmentName}</td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Monthly Salary</th>
                    <th>Annual Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.map((s) => (
                    <tr key={s.employeeId}>
                      <td className="font-monospace">{s.employeeCode}</td>
                      <td className="fw-bold">{s.employeeName}</td>
                      <td>{s.departmentName}</td>
                      <td>{s.designation}</td>
                      <td className="fw-bold text-success">${s.monthlySalary.toLocaleString()}</td>
                      <td className="fw-semibold">${s.annualSalary.toLocaleString()}</td>
                      <td>
                        <span className="badge bg-light text-dark border">{s.employmentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
