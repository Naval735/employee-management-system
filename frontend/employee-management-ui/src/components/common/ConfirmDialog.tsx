import React from 'react';

interface ConfirmDialogProps {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center text-danger">
              <i className="bi bi-exclamation-octagon me-2"></i>
              {title}
            </h5>
            <button type="button" className="btn-close" disabled={isLoading} onClick={onCancel}></button>
          </div>
          <div className="modal-body py-4">
            <p className="mb-0 text-secondary">{message}</p>
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-outline-secondary" disabled={isLoading} onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={`btn btn-${confirmVariant}`} disabled={isLoading} onClick={onConfirm}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
