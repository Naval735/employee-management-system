import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';

export const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Please enter both username/email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login({ usernameOrEmail, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setUsernameOrEmail('admin');
    setPassword('Admin@123');
    setError(null);
  };

  const fillDemoHr = () => {
    setUsernameOrEmail('hr');
    setPassword('Hr@123');
    setError(null);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white text-center py-4 border-0">
                <div
                  className="rounded-circle bg-white text-primary d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="bi bi-person-badge-fill fs-2"></i>
                </div>
                <h4 className="fw-bold mb-1">Employee Management</h4>
                <p className="small text-white-50 mb-0">Sign in to your HR Dashboard</p>
              </div>

              <div className="card-body p-4 p-sm-5">
                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary">Username or Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="admin or admin@company.com"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-semibold text-secondary mb-0">Password</label>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control bg-light border-start-0 border-end-0 ps-0"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light text-muted border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2.5 fw-semibold shadow-sm rounded-3 mb-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="border-top pt-3 mt-3">
                  <div className="text-center text-muted small fw-semibold mb-2">
                    Quick Demo Credentials
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={fillDemoAdmin}
                    >
                      <i className="bi bi-shield-lock me-1"></i> Admin
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={fillDemoHr}
                    >
                      <i className="bi bi-person-workspace me-1"></i> HR User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
