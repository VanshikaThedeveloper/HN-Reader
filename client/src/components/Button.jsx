// Reusable Button component that adapts to variant and loading state
const Button = ({ children, variant = "primary", loading = false, className = "", ...props }) => {
  const variantClass = variant === "danger" ? "btn-danger" : "btn-primary";

  return (
    <button className={`btn ${variantClass} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <>
          <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default Button;
