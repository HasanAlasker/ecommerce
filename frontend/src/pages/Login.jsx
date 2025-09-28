import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      console.log("Login button clicked");
      const result = await login(values.email, values.password);
      
      if (result.success) {
        setStatus({ type: "success", message: "Login successful!" });
        navigate("/");
      } else {
        setStatus({ type: "error", message: result.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus({ type: "error", message: "Login failed" });
    }
    setSubmitting(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="flower-icon">🌹</div>
          <h1 className="register-title">Welcome Back</h1>
          <p className="register-subtitle">Sign in to your floral account</p>
        </div>

        <Formik
          initialValues={{
            email: '',
            password: '',
            rememberMe: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors, status }) => (
            <Form className="register-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="form-extras">
                <label className="remember-me">
                  <Field type="checkbox" name="rememberMe" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>

              {status && (
                <div
                  className={`status-message ${
                    status.type === "error" ? "error-status" : "success-status"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`submit-button ${isSubmitting || loading ? 'loading' : ''}`}
              >
                {(isSubmitting || loading) ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="form-footer">
                <p>Don't have an account? <a href="/register" className="link">Create Account</a></p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}