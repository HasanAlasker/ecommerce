import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function Login() {
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Login values:', values);
    setTimeout(() => {
      alert('Login successful!');
      setSubmitting(false);
    }, 1000);
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
          {({ isSubmitting, touched, errors }) => (
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
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