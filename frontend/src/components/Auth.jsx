import { useState } from "react";
import { registerUser, loginUser } from "../services/api";

export default function Auth() {
  const [tab, setTab] = useState("login"); // "login" | "register"

  return (
    <div className="auth-wrapper">
      <div className="card">
        <div className="tabs">
          <button
            className={tab === "login" ? "tab active" : "tab"}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "register" ? "tab active" : "tab"}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {tab === "login" ? <LoginForm /> : <RegisterForm onSwitch={() => setTab("login")} />}
      </div>
    </div>
  );
}

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username || "");
      if (data.role === "admin") window.location.href = "/dashboard";
      else window.location.href = "/welcome";
    } catch (err) {
      setError(err?.response?.data?.message || "Server error");
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label>Email</label>
        <input name="email" type="email" placeholder="you@example.com" onChange={onChange} required />
      </div>

      <div className="field">
        <label>Password</label>
        <div className="password-wrap">
          <input
            name="password"
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            onChange={onChange}
            required
          />
          <button type="button" className="toggle" onClick={() => setShowPwd((s) => !s)}>
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <button className="primary" type="submit">Sign in</button>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const { data } = await registerUser(form);
      setMsg(data.message || "Registered successfully");
      // بعد التسجيل: أوتوماتيك رجّع المستخدم لشاشة الدخول
      setTimeout(() => onSwitch?.(), 800);
    } catch (err) {
      setError(err?.response?.data?.message || "Server error");
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label>Username</label>
        <input name="username" placeholder="Your name" onChange={onChange} required />
      </div>

      <div className="field">
        <label>Email</label>
        <input name="email" type="email" placeholder="you@example.com" onChange={onChange} required />
      </div>

      <div className="field">
        <label>Password</label>
        <div className="password-wrap">
          <input
            name="password"
            type={showPwd ? "text" : "password"}
            placeholder="Create a strong password"
            onChange={onChange}
            required
          />
          <button type="button" className="toggle" onClick={() => setShowPwd((s) => !s)}>
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}

      <button className="primary" type="submit">Create account</button>
    </form>
  );
}
