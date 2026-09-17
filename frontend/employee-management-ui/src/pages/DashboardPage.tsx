import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardSummary } from '../types/dashboard.types';
import dashboardService from '../services/dashboardService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const COLORS = ['#1E3A8A', '#065F46', '#7C2D12', '#4C1D95', '#D97706', '#2563EB', '#059669'];

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    dashboardService
      .getSummary()
      .then(setSummary)
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load dashboard summary analytics.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard metrics & charts..." />;
  }

  if (error || !summary) {
    return <ErrorMessage message={error || 'Dashboard data unavailable.'} />;
  }

  const attendanceChartData = [
    { name: 'Present', value: summary.presentToday, color: '#10B981' },
    { name: 'Absent', value: summary.absentToday, color: '#EF4444' },
    { name: 'On Leave', value: summary.onLeaveToday, color: '#F59E0B' },
    { name: 'Half Day', value: summary.halfDayToday, color: '#06B6D4' },
  ];

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">HR Executive Dashboard</h2>
          <p className="text-muted mb-0">Overview of workforce stats, department metrics, payroll & attendance</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/reports" className="btn btn-outline-primary d-flex align-items-center">
            <i className="bi bi-file-earmark-pdf me-2"></i> Export Reports
          </Link>
          <Link to="/employees/new" className="btn btn-primary d-flex align-items-center shadow-sm">
            <i className="bi bi-person-plus-fill me-2"></i> Add Employee
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3 bg-gradient" style={{ borderLeft: '4px solid #2563EB' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block text-uppercase">Total Employees</span>
                <h2 className="fw-bold text-dark mb-0 mt-1">{summary.totalEmployees}</h2>
                <small className="text-success fw-semibold">
                  <i className="bi bi-graph-up me-1"></i>Active Workforce
                </small>
              </div>
              <div className="rounded-3 bg-primary-subtle text-primary p-3">
                <i className="bi bi-people-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #059669' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block text-uppercase">Departments</span>
                <h2 className="fw-bold text-dark mb-0 mt-1">{summary.totalDepartments}</h2>
                <small className="text-muted fw-semibold">Structured Teams</small>
              </div>
              <div className="rounded-3 bg-success-subtle text-success p-3">
                <i className="bi bi-building fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #D97706' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block text-uppercase">Present Today</span>
                <h2 className="fw-bold text-dark mb-0 mt-1">{summary.presentToday}</h2>
                <small className="text-muted fw-semibold">{summary.onLeaveToday} On Leave Today</small>
              </div>
              <div className="rounded-3 bg-warning-subtle text-warning-emphasis p-3">
                <i className="bi bi-calendar-check-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #7C2D12' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block text-uppercase">Monthly Payroll</span>
                <h2 className="fw-bold text-dark mb-0 mt-1">
                  ${(summary.totalMonthlyPayroll / 1000).toFixed(1)}k
                </h2>
                <small className="text-muted fw-semibold">Avg: ${summary.averageSalary.toLocaleString()}/mo</small>
              </div>
              <div className="rounded-3 bg-danger-subtle text-danger p-3">
                <i className="bi bi-cash-stack fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="row g-4 mb-4">
        {/* Chart 1: Department Distribution */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-primary">Employees by Department</h5>
            </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={summary.departmentDistribution}
                    dataKey="employeeCount"
                    nameKey="departmentName"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label={(entry: any) => `${entry.departmentCode || ''}: ${entry.employeeCount || 0}`}
                  >
                    {summary.departmentDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} Employees`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 2: Salary Distribution */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-primary">Salary Distribution Ranges</h5>
            </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={summary.salaryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="employeeCount" name="Headcount" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 3: Today's Attendance Breakdown */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-primary">Today's Attendance Breakdown</h5>
            </div>
            <div className="card-body p-3">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={attendanceChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {attendanceChartData.map((entry, index) => (
                      <Cell key={`att-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 4: Hiring Trend (Bonus Feature) */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-primary">Hiring Trend Analysis</h5>
            </div>
            <div className="card-body p-3">
              {summary.hiringTrends.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-graph-up display-5 d-block mb-2"></i>
                  No recent hiring data for chart display.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={summary.hiringTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthYear" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="hiredCount" name="Hired" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feeds Row */}
      <div className="row g-4">
        {/* Recent Employees */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-bold mb-0 text-primary">Recently Joined Employees</h5>
              <Link to="/employees" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {summary.recentEmployees.map((emp) => (
                  <li key={emp.id} className="list-group-item p-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3 fw-bold"
                        style={{ width: '40px', height: '40px' }}
                      >
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <Link to={`/employees/${emp.id}`} className="fw-semibold text-dark text-decoration-none">
                          {emp.fullName}
                        </Link>
                        <div className="small text-muted">
                          {emp.designation} • {emp.departmentName}
                        </div>
                      </div>
                    </div>
                    <span className="badge bg-light text-dark border">${emp.salary.toLocaleString()}/mo</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-bold mb-0 text-primary">Latest Attendance Activity</h5>
              <Link to="/attendance" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {summary.recentAttendance.map((att) => (
                  <li key={att.id} className="list-group-item p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold text-dark">{att.employeeName}</div>
                      <small className="text-muted">
                        {att.departmentName} • {new Date(att.date).toLocaleDateString()}
                      </small>
                    </div>
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
