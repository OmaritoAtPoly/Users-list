import "./styles/Status.css";

export interface StatusProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  label?: string;
}

export const Status = ({
  loading,
  error,
  onRetry,
  label = "Status",
}: StatusProps) => {
  if (loading) {
    return (
      <div role="status" aria-label={label} className="status-container">
        <div className="status-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" aria-label={label} className="status-container">
        {error}
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default Status;
