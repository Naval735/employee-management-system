import React from 'react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-width-md mx-auto py-3">
      <div className="card border-0 shadow-sm overflow-hidden mb-4">
        <div className="card-header bg-primary text-white p-4 text-center">
          <div
            className="rounded-circle bg-white text-primary d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: '80px', height: '80px', fontSize: '28px', fontWeight: 'bold' }}
          >
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <h3 className="fw-bold mb-1">{user.fullName || user.username}</h3>
          <span className="badge bg-white text-primary px-3 py-1.5 fs-6 fw-semibold">{user.role} Account</span>
        </div>

        <div className="card-body p-4">
          <h5 className="fw-bold text-primary mb-3">Account Details</h5>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <span className="text-muted d-block small">Username</span>
              <span className="fw-semibold text-dark fs-6">{user.username}</span>
            </div>
            <div className="col-12 col-sm-6">
              <span className="text-muted d-block small">Email Address</span>
              <span className="fw-semibold text-dark fs-6">{user.email}</span>
            </div>
            <div className="col-12 col-sm-6">
              <span className="text-muted d-block small">Access Role</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-6 me-2">
                {user.role}
              </span>
            </div>
            <div className="col-12 col-sm-6">
              <span className="text-muted d-block small">Linked Employee ID</span>
              <span className="fw-semibold text-dark">{user.employeeId ? `ID #${user.employeeId}` : 'None'}</span>
            </div>
          </div>

          <hr className="my-4" />

          <h5 className="fw-bold text-primary mb-3">Permissions Overview</h5>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item d-flex align-items-center px-0">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <span>View Employee Directory & Detailed Profiles</span>
            </li>
            <li className="list-group-item d-flex align-items-center px-0">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <span>View Department Hierarchy & Turnout Stats</span>
            </li>
            <li className="list-group-item d-flex align-items-center px-0">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <span>Export Reports to PDF and ClosedXML Excel</span>
            </li>
            {user.role === 'Admin' && (
              <li className="list-group-item d-flex align-items-center px-0">
                <i className="bi bi-shield-fill-check text-primary me-2"></i>
                <span className="fw-bold">Full Administrative Privileges (Delete & Bulk Operations)</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
