"use client";

import { useForm } from "react-hook-form";
import { Button } from "antd";
import { LockOutlined, MailOutlined, RocketOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useLogin } from "@/hooks/useLogin";
import { useState } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login, loading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  return (
    <div className="login-wrapper">
      <div className="login-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>
      <div className="login-card">
        <div className="login-logo">
          <RocketOutlined />
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your portfolio admin</p>
        <form onSubmit={handleSubmit(login)} noValidate>
          <div className="rhf-field">
            <label className="rhf-label">Email</label>
            <div className={`rhf-input-wrapper ${errors.email ? "rhf-input-error" : ""}`}>
              <span className="rhf-input-icon"><MailOutlined /></span>
              <input
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
            </div>
            {errors.email && <span className="rhf-error">{errors.email.message}</span>}
          </div>

          <div className="rhf-field">
            <label className="rhf-label">Password</label>
            <div className={`rhf-input-wrapper ${errors.password ? "rhf-input-error" : ""}`}>
              <span className="rhf-input-icon"><LockOutlined /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 3,
                    message: "Password must be at least 3 characters",
                  },
                })}
              />
              <button
                type="button"
                className="rhf-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </button>
            </div>
            {errors.password && <span className="rhf-error">{errors.password.message}</span>}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="login-btn"
            style={{ marginTop: 8 }}
          >
            Sign In
          </Button>
        </form>
        <div className="login-footer">
          Powered by <span>Portfolio Admin</span>
        </div>
      </div>
    </div>
  );
}
