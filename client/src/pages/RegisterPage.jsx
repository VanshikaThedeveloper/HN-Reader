import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start bookmarking your favourite stories</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Full Name"
            id="reg-name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          <Input
            label="Email"
            id="reg-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <Input
            label="Password"
            id="reg-password"
            type="password"
            name="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <div style={{ marginTop: "0.5rem" }}>
            <Button type="submit" loading={loading}>
              Create Account
            </Button>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
