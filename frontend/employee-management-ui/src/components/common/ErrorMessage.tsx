import React from 'react';

interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center shadow-sm mb-4" role="alert">
      <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2 fs-5"></i>
      <div className="flex-grow-1">{message}</div>
      {onDismiss && (
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onDismiss}
        ></button>
      )}
    </div>
  );
};

export default ErrorMessage;
