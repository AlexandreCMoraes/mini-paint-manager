// src/components/Login/Login.js
import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
import FormUtils from './form-utils';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        FormUtils.addEntranceAnimation(document.querySelector('.login-card'));
        FormUtils.setupFloatingLabels(formRef.current);
        FormUtils.setupPasswordToggle(
            document.getElementById('password'),
            document.getElementById('passwordToggle')
        );
        FormUtils.addSharedAnimations();
    }, []);

    const validateField = (fieldName, value) => {
        const validators = {
            email: FormUtils.validateEmail,
            password: FormUtils.validatePassword
        };
        const result = validators[fieldName](value);
        if (result.isValid) FormUtils.showSuccess(fieldName);
        else FormUtils.showError(fieldName, result.message);
        return result.isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();

        const isValid = validateField('email', email) && validateField('password', password);
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            await FormUtils.simulateLogin(email, password);
            setShowSuccess(true);
            navigate('/miniaturas'); // Redireciona para a página principal do sistema
            setTimeout(() => {
                setShowSuccess(false);
                if (formRef.current) {
                    formRef.current.reset();
                }
            }, 3000);
        } catch (error) {
            FormUtils.showNotification(error.message, 'error', formRef.current);
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className="login-container-body">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form ref={formRef} className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                autoComplete="email"
                                onBlur={(e) => validateField('email', e.target.value)}
                            />
                            <label htmlFor="email">Email Address</label>
                            <span className="focus-border"></span>
                        </div>
                        <span className="error-message" id="emailError"></span>
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper password-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                onBlur={(e) => validateField('password', e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                            <button
                                type="button"
                                className="password-toggle"
                                id="passwordToggle"
                                aria-label="Toggle password visibility"
                            >
                                <span className="eye-icon"></span>
                            </button>
                            <span className="focus-border"></span>
                        </div>
                        <span className="error-message" id="passwordError"></span>
                    </div>

                    <div className="form-options">
                        <label className="remember-wrapper">
                            <input type="checkbox" id="remember" name="remember" />
                            <span className="checkbox-label">
                                <span className="checkmark"></span>
                                Remember me
                            </span>
                        </label>
                        <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className={`login-btn btn ${isSubmitting ? 'loading' : ''}`}>
                        <span className="btn-text">Sign In</span>
                        <span className="btn-loader"></span>
                    </button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button type="button" className="social-btn google-btn">
                        <span className="social-icon google-icon"></span>
                        Google
                    </button>
                    <button type="button" className="social-btn github-btn">
                        <span className="social-icon github-icon"></span>
                        GitHub
                    </button>
                </div>

                <div className="signup-link">
                    <p>Don't have an account? <a href="#">Sign up</a></p>
                </div>

                {showSuccess && (
                    <div className="success-message show">
                        <div className="success-icon">✓</div>
                        <h3>Login Successful!</h3>
                        <p>Redirecting to your dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;