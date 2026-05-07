import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 👋");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to access your bookmarks</p>

        {/* Error banner */}
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <Input
            label="Password"
            id="login-password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <div style={{ marginTop: "0.5rem" }}>
            <Button type="submit" loading={loading}>
              Sign In
            </Button>
          </div>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
