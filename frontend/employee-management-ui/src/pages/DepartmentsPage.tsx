import React, { useState, useEffect } from 'react';
import { Department, CreateDepartmentPayload } from '../types/department.types';
import departmentService from '../services/departmentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

export const DepartmentsPage: React.FC = () => {
  const { user } = useAuth();
  const isHrOrAdmin = user?.role === 'Admin' || user?.role === 'HR';
  const isAdmin = user?.role === 'Admin';

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [modalFormData, setModalFormData] = useState<CreateDepartmentPayload>({ code: '', name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load department records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditingDepartment(null);
    setModalFormData({ code: '', name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDepartment(dept);
    setModalFormData({ code: dept.code, name: dept.name, description: dept.description || '' });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFormData.code.trim() || !modalFormData.name.trim()) {
      setError('Please provide both department code and name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingDepartment) {
        await departmentService.updateDepartment(editingDepartment.id, modalFormData);
        setSuccessMessage(`Department '${modalFormData.name}' updated successfully.`);
      } else {
        await departmentService.createDepartment(modalFormData);
        setSuccessMessage(`Department '${modalFormData.name}' created successfully.`);
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError(null);
    try {
      await departmentService.deleteDepartment(deleteTarget.id);
      setSuccessMessage(`Department '${deleteTarget.name}' deleted successfully.`);
      setDeleteTarget(null);
      fetchDepartments();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to delete department.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Department Management</h2>
          <p className="text-muted mb-0">Organize company structure, view employee counts, and manage departments</p>
        </div>

        {isHrOrAdmin && (
          <button type="button" className="btn btn-primary d-flex align-items-center shadow-sm" onClick={openAddModal}>
            <i className="bi bi-plus-circle-fill me-2"></i> Add Department
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

      {isLoading ? (
        <LoadingSpinner message="Loading departments..." />
      ) : (
        <div className="row g-4">
          {departments.map((dept) => (
            <div key={dept.id} className="col-12 col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm h-100 position-relative hover-shadow">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 font-monospace fs-6">
                      {dept.code}
                    </span>
                    <span className="badge bg-light text-dark border fs-6">
                      <i className="bi bi-people-fill text-primary me-1"></i> {dept.employeeCount} Employees
                    </span>
                  </div>

                  <h4 className="fw-bold text-dark mb-2">{dept.name}</h4>
                  <p className="text-muted small flex-grow-1">{dept.description || 'No description provided.'}</p>

                  <div className="border-top pt-3 mt-3 d-flex justify-content-end gap-2">
                    {isHrOrAdmin && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditModal(dept)}
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteTarget(dept)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  {editingDepartment ? 'Edit Department' : 'Add New Department'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleModalSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Department Code *</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      placeholder="e.g. ENG, HR, FIN"
                      value={modalFormData.code}
                      onChange={(e) => setModalFormData({ ...modalFormData, code: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Department Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Software Engineering"
                      value={modalFormData.name}
                      onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Brief description of department scope..."
                      value={modalFormData.description || ''}
                      onChange={(e) => setModalFormData({ ...modalFormData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Department"
        message={`Are you sure you want to delete department '${deleteTarget?.name}' (${deleteTarget?.code})?`}
        confirmText="Delete Department"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default DepartmentsPage;
