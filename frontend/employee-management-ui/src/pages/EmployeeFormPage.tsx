import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Department } from '../types/department.types';
import { CreateEmployeePayload, GenderType, EmploymentStatusType } from '../types/employee.types';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const EmployeeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateEmployeePayload>({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: new Date(1995, 0, 1).toISOString().split('T')[0],
    gender: 'Male',
    address: '',
    departmentId: 0,
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 50000,
    employmentStatus: 'FullTime',
  });

  useEffect(() => {
    departmentService.getDepartments().then((depts) => {
      setDepartments(depts);
      if (depts.length > 0 && !isEditMode) {
        setFormData((prev) => ({ ...prev, departmentId: depts[0].id }));
      }
    });

    if (isEditMode) {
      setIsLoading(true);
      employeeService
        .getEmployeeById(Number(id))
        .then((emp) => {
          setFormData({
            employeeCode: emp.employeeCode,
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: emp.phone,
            dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
            gender: emp.gender,
            address: emp.address,
            departmentId: emp.departmentId,
            designation: emp.designation,
            joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
            salary: emp.salary,
            employmentStatus: emp.employmentStatus,
          });
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to load employee details.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'departmentId' || name === 'salary' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.departmentId === 0) {
      setError('Please select a department.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await employeeService.updateEmployee(Number(id), formData);
      } else {
        await employeeService.createEmployee(formData);
      }
      navigate('/employees');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to save employee record.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading employee details..." />;
  }

  return (
    <div className="max-width-lg mx-auto py-2">
      <div className="d-flex align-items-center mb-4">
        <Link to="/employees" className="btn btn-outline-secondary me-3">
          <i className="bi bi-arrow-left"></i>
        </Link>
        <div>
          <h2 className="fw-bold mb-0">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
          <p className="text-muted mb-0">Fill in employee details, department, and salary information</p>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="card-title fw-bold mb-0 text-primary">Personal Information</h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Gender *</label>
                <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Residential Address *</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="card-title fw-bold mb-0 text-primary">Job & Compensation</h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Employee Code</label>
                <input
                  type="text"
                  name="employeeCode"
                  className="form-control"
                  placeholder="Auto-generated if left blank (e.g. EMP-007)"
                  value={formData.employeeCode || ''}
                  onChange={handleChange}
                  disabled={isEditMode}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Department *</label>
                <select
                  name="departmentId"
                  className="form-select"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                >
                  <option value={0}>Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Designation / Role Title *</label>
                <input
                  type="text"
                  name="designation"
                  className="form-control"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Joining Date *</label>
                <input
                  type="date"
                  name="joiningDate"
                  className="form-control"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Monthly Base Salary ($) *</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="salary"
                    className="form-control"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Employment Status *</label>
                <select
                  name="employmentStatus"
                  className="form-select"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                >
                  <option value="FullTime">Full Time</option>
                  <option value="PartTime">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to="/employees" className="btn btn-outline-secondary px-4">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary px-5 shadow-sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : isEditMode ? (
              'Update Employee'
            ) : (
              'Save Employee'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormPage;
