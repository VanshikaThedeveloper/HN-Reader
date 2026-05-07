// Reusable labeled form input with error support
const Input = ({ label, id, error, className = "", ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <input id={id} className={`form-input ${className}`} {...props} />
    {error && <p style={{ color: "var(--color-danger)", fontSize: "0.775rem", marginTop: "0.3rem" }}>{error}</p>}
  </div>
);

export default Input;
