import React from 'react';
import { AttendanceSummary } from '../../types/attendance.types';

interface AttendanceSummaryWidgetProps {
  summary: AttendanceSummary | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const AttendanceSummaryWidget: React.FC<AttendanceSummaryWidgetProps> = ({
  summary,
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <h5 className="card-title fw-bold mb-0 text-primary d-flex align-items-center">
          <i className="bi bi-calendar-check me-2"></i> Attendance Overview
        </h5>
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0 small text-muted fw-semibold">Target Date:</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>
      <div className="card-body p-4">
        <div className="row g-3">
          <div className="col-6 col-md-4 col-xl-2">
            <div className="p-3 bg-light rounded-3 text-center border">
              <span className="text-muted small d-block fw-semibold mb-1">Total Active</span>
              <span className="fs-3 fw-bold text-dark">{summary?.totalEmployees || 0}</span>
            </div>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <div className="p-3 bg-success-subtle rounded-3 text-center border border-success-subtle">
              <span className="text-success small d-block fw-semibold mb-1">Present</span>
              <span className="fs-3 fw-bold text-success">{summary?.presentCount || 0}</span>
            </div>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <div className="p-3 bg-danger-subtle rounded-3 text-center border border-danger-subtle">
              <span className="text-danger small d-block fw-semibold mb-1">Absent</span>
              <span className="fs-3 fw-bold text-danger">{summary?.absentCount || 0}</span>
            </div>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <div className="p-3 bg-warning-subtle rounded-3 text-center border border-warning-subtle">
              <span className="text-warning-emphasis small d-block fw-semibold mb-1">On Leave</span>
              <span className="fs-3 fw-bold text-warning-emphasis">{summary?.leaveCount || 0}</span>
            </div>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <div className="p-3 bg-info-subtle rounded-3 text-center border border-info-subtle">
              <span className="text-info-emphasis small d-block fw-semibold mb-1">Half Day</span>
              <span className="fs-3 fw-bold text-info-emphasis">{summary?.halfDayCount || 0}</span>
            </div>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <div className="p-3 bg-primary-subtle rounded-3 text-center border border-primary-subtle">
              <span className="text-primary small d-block fw-semibold mb-1">Turnout Rate</span>
              <span className="fs-3 fw-bold text-primary">{summary?.attendanceRatePercentage || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryWidget;
