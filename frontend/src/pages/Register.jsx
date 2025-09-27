import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
    .required('Password is required'),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .required('Address is required'),
  phone: Yup.string()
    .matches(/^[\]?[1-9][\d]{0,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
});

export default function Register() {
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Registration values:', values);
    setTimeout(() => {
      alert('Registration submitted successfully!');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="flower-icon">🌸</div>
          <h1 className="register-title">Join Our Garden</h1>
          <p className="register-subtitle">Create your account to start your floral journey</p>
        </div>

        <Formik
          initialValues={{
            fullName: '',
            email: '',
            password: '',
            address: '',
            phone: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="register-form">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <Field
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${touched.fullName && errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                <ErrorMessage name="fullName" component="div" className="error-message" />
              </div>

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
                  placeholder="Create a strong password"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Address</label>
                <Field
                  type="text"
                  id="address"
                  name="address"
                  className={`form-input ${touched.address && errors.address ? 'error' : ''}`}
                  placeholder="Enter your address"
                />
                <ErrorMessage name="address" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
                  placeholder="Enter your phone number"
                />
                <ErrorMessage name="phone" component="div" className="error-message" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="form-footer">
                <p>Already have an account? <a href="/login" className="link">Sign In</a></p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}