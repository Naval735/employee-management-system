import React from 'react';
import { Department } from '../../types/department.types';
import { EmploymentStatusType } from '../../types/employee.types';

interface SearchFilterBarProps {
  search: string;
  departmentId: number | undefined;
  status: EmploymentStatusType | undefined;
  departments: Department[];
  onSearchChange: (search: string) => void;
  onDepartmentChange: (deptId: number | undefined) => void;
  onStatusChange: (status: EmploymentStatusType | undefined) => void;
  onReset: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  departmentId,
  status,
  departments,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by Name, Email or Code..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <select
              className="form-select"
              value={departmentId || ''}
              onChange={(e) => onDepartmentChange(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <select
              className="form-select"
              value={status || ''}
              onChange={(e) => onStatusChange(e.target.value ? (e.target.value as EmploymentStatusType) : undefined)}
            >
              <option value="">All Statuses</option>
              <option value="FullTime">Full Time</option>
              <option value="PartTime">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          <div className="col-12 col-md-2 d-flex justify-content-end">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={onReset}>
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
