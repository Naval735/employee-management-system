import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Employee, EmploymentStatusType, PaginatedResult } from '../types/employee.types';
import { Department } from '../types/department.types';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import SearchFilterBar from '../components/employees/SearchFilterBar';
import EmployeeTable from '../components/employees/EmployeeTable';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

export const EmployeesPage: React.FC = () => {
  const { user } = useAuth();
  const isHrOrAdmin = user?.role === 'Admin' || user?.role === 'HR';
  const isAdmin = user?.role === 'Admin';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResult<Employee> | null>(null);

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<EmploymentStatusType | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Departments for dropdown filter
  useEffect(() => {
    departmentService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees({
        search: search.trim() || undefined,
        departmentId,
        status,
        pageNumber: currentPage,
        pageSize,
      });
      setPaginatedData(data);
      setEmployees(data.items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch employee records.');
    } finally {
      setIsLoading(false);
    }
  }, [search, departmentId, status, currentPage, pageSize]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentId(undefined);
    setStatus(undefined);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(employees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await employeeService.deleteEmployee(deleteTarget.id);
      setSuccessMessage(`Employee '${deleteTarget.fullName}' was deleted successfully.`);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete employee.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await employeeService.bulkDeleteEmployees(selectedIds);
      setSuccessMessage(res.message);
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to bulk delete employees.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Employee Directory</h2>
          <p className="text-muted mb-0">Manage employee records, view profiles, and perform bulk operations</p>
        </div>

        <div className="d-flex gap-2">
          {isAdmin && selectedIds.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center"
              onClick={() => setShowBulkDeleteModal(true)}
            >
              <i className="bi bi-trash me-2"></i> Delete Selected ({selectedIds.length})
            </button>
          )}

          {isHrOrAdmin && (
            <Link to="/employees/new" className="btn btn-primary d-flex align-items-center shadow-sm">
              <i className="bi bi-person-plus-fill me-2"></i> Add Employee
            </Link>
          )}
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
          ></button>
        </div>
      )}

      <SearchFilterBar
        search={search}
        departmentId={departmentId}
        status={status}
        departments={departments}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onDepartmentChange={(val) => {
          setDepartmentId(val);
          setCurrentPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      {isLoading ? (
        <LoadingSpinner message="Fetching employee records..." />
      ) : (
        <>
          <EmployeeTable
            employees={employees}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onDeleteOne={(emp) => setDeleteTarget(emp)}
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

      {/* Single Delete Confirmation Modal */}
      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Employee Record"
        message={`Are you sure you want to delete employee '${deleteTarget?.fullName}' (${deleteTarget?.employeeCode})? This action cannot be undone.`}
        confirmText="Delete Employee"
        isLoading={isDeleting}
        onConfirm={handleConfirmSingleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmDialog
        show={showBulkDeleteModal}
        title="Bulk Delete Employees"
        message={`Are you sure you want to permanently delete ${selectedIds.length} selected employee record(s)?`}
        confirmText={`Delete ${selectedIds.length} Employees`}
        isLoading={isDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteModal(false)}
      />
    </div>
  );
};

export default EmployeesPage;
