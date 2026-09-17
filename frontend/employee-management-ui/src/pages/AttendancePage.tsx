import React, { useState, useEffect, useCallback } from 'react';
import { Attendance, AttendanceStatusType, AttendanceSummary, CreateAttendancePayload } from '../types/attendance.types';
import { Employee, PaginatedResult } from '../types/employee.types';
import attendanceService from '../services/attendanceService';
import employeeService from '../services/employeeService';
import AttendanceSummaryWidget from '../components/attendance/AttendanceSummaryWidget';
import AttendanceTable from '../components/attendance/AttendanceTable';
import MarkAttendanceModal from '../components/attendance/MarkAttendanceModal';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const isHrOrAdmin = user?.role === 'Admin' || user?.role === 'HR';

  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [paginatedData, setPaginatedData] = useState<PaginatedResult<Attendance> | null>(null);

  // Filter state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [status, setStatus] = useState<AttendanceStatusType | undefined>(undefined);
  const [summaryDate, setSummaryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Attendance | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    employeeService.getEmployees({ pageSize: 200 }).then((res) => setEmployees(res.items)).catch(() => {});
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await attendanceService.getSummary(summaryDate);
      setSummary(data);
    } catch (e) {}
  }, [summaryDate]);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getAttendanceRecords({
        employeeId: selectedEmployeeId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status,
        pageNumber: currentPage,
        pageSize,
      });
      setPaginatedData(data);
      setRecords(data.items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load attendance records.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmployeeId, startDate, endDate, status, currentPage, pageSize]);

  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, [fetchRecords, fetchSummary]);

  const handleResetFilters = () => {
    setSelectedEmployeeId(undefined);
    setStartDate('');
    setEndDate('');
    setStatus(undefined);
    setCurrentPage(1);
  };

  const handleSaveAttendance = async (payload: CreateAttendancePayload, isEditMode: boolean) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEditMode && editingRecord) {
        await attendanceService.updateAttendance(editingRecord.id, {
          status: payload.status,
          remarks: payload.remarks,
        });
        setSuccessMessage('Attendance record updated successfully.');
      } else {
        await attendanceService.markAttendance(payload);
        setSuccessMessage('Attendance marked successfully.');
      }
      setShowModal(false);
      setEditingRecord(null);
      fetchRecords();
      fetchSummary();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save attendance record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await attendanceService.deleteAttendance(deleteTarget.id);
      setSuccessMessage('Attendance record deleted.');
      setDeleteTarget(null);
      fetchRecords();
      fetchSummary();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete attendance record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Attendance Management</h2>
          <p className="text-muted mb-0">Track daily employee attendance, mark leaves, and view turnout stats</p>
        </div>

        {isHrOrAdmin && (
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center shadow-sm"
            onClick={() => {
              setEditingRecord(null);
              setShowModal(true);
            }}
          >
            <i className="bi bi-calendar-plus me-2"></i> Mark Attendance
          </button>
        )}
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
        </div>
      )}

      {/* Summary Stats Widget */}
      <AttendanceSummaryWidget
        summary={summary}
        selectedDate={summaryDate}
        onDateChange={(d) => setSummaryDate(d)}
      />

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <select
                className="form-select"
                value={selectedEmployeeId || ''}
                onChange={(e) => {
                  setSelectedEmployeeId(e.target.value ? Number(e.target.value) : undefined);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Employees</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} ({e.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="col-12 col-sm-6 col-md-2">
              <select
                className="form-select"
                value={status || ''}
                onChange={(e) => {
                  setStatus(e.target.value ? (e.target.value as AttendanceStatusType) : undefined);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
                <option value="HalfDay">Half Day</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-1 d-flex justify-content-end">
              <button type="button" className="btn btn-outline-secondary w-100" onClick={handleResetFilters}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading attendance logs..." />
      ) : (
        <>
          <AttendanceTable
            records={records}
            onEdit={(rec) => {
              setEditingRecord(rec);
              setShowModal(true);
            }}
            onDelete={(rec) => setDeleteTarget(rec)}
          />

          {paginatedData && (
            <Pagination
              currentPage={paginatedData.pageNumber}
              totalPages={paginatedData.totalPages}
              totalCount={paginatedData.totalCount}
              pageSize={paginatedData.pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}

      {/* Mark Attendance Modal */}
      <MarkAttendanceModal
        show={showModal}
        employees={employees}
        editingRecord={editingRecord}
        isSubmitting={isSubmitting}
        onSave={handleSaveAttendance}
        onClose={() => {
          setShowModal(false);
          setEditingRecord(null);
        }}
      />

      {/* Delete Modal */}
      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Attendance Record"
        message={`Are you sure you want to delete attendance record for '${deleteTarget?.employeeName}' on ${
          deleteTarget?.date ? new Date(deleteTarget.date).toLocaleDateString() : ''
        }?`}
        confirmText="Delete Record"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AttendancePage;
