import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
// Importa as funções utilitárias para o formulário
import FormUtils from '../../utils/form-utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

// O componente Login é responsável por renderizar a página de login da 
// aplicação. Ele inclui um formulário com campos para user, email e senha, 
// validação de entrada, animações de foco e feedback visual para o 
// usuário. O componente também integra a funcionalidade de autenticação, 
// permitindo que o usuário faça login e seja redirecionado para a página 
// principal da aplicação.
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    // Estado para alternar entre login e cadastro
    const [isSignUp, setIsSignUp] = useState(false);
    // Estado para modo forgot password
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    // Estado para controlar se já validou o email no forgot password
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1 = email, 2 = nova senha
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Adiciona animações e configurações de rótulos flutuantes ao 
    // montar o componente
    useEffect(() => {
        FormUtils.addEntranceAnimation(document.querySelector('.login-card'));
        FormUtils.setupFloatingLabels(formRef.current);
        FormUtils.addSharedAnimations();
    }, []);

    const validateField = (fieldName, value, formElement = null) => {
        const validators = {
            username: FormUtils.validateUsername,
            email: FormUtils.validateEmail,
            password: FormUtils.validatePassword,
            confirmPassword: (value) => {
                if (!value) return { isValid: false, message: 'Confirm password is required' };
                const passwordValue = formElement?.querySelector('#password')?.value || '';
                if (value !== passwordValue) return { isValid: false, message: 'Passwords do not match' };
                return { isValid: true };
            }
        };
        const result = validators[fieldName](value);

        // Usar notificações padronizadas do projeto ao invés de console
        if (!result.isValid) {
            FormUtils.showNotification(result.message, 'error');
        }

        result.isValid ? FormUtils.showSuccess(fieldName) : FormUtils.showError(fieldName, result.message);
        return result.isValid;
    };

    const submitToApi = async ({ username, email, password }) => {
        const endpoint = isSignUp ? API_ENDPOINTS.REGISTER : API_ENDPOINTS.LOGIN;
        const payload = isSignUp ? { username, email, password } : { username, password };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Falha ao autenticar');
        }

        return data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (isForgotPassword) {
            if (forgotPasswordStep === 1) {
                // Primeiro passo: validar email
                const email = e.target.email.value.trim();
                if (!validateField('email', email)) return;
                
                // Aqui vamos validar se o email existe no backend
                setIsSubmitting(true);
                try {
                    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/auth/check-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });
                    
                    if (!response.ok) {
                        throw new Error('Email not found');
                    }
                    
                    // Email existe, passar para o próximo passo
                    setForgotPasswordStep(2);
                } catch (error) {
                    FormUtils.showNotification(error.message, 'error', formRef.current);
                } finally {
                    setIsSubmitting(false);
                }
                return;
            } else {
                // Segundo passo: alterar senha
                const email = e.target.email.value.trim();
                const password = e.target.password.value.trim();
                const confirmPassword = e.target.confirmPassword.value.trim();
                
                if (!validateField('password', password) || !validateField('confirmPassword', confirmPassword, formRef.current)) return;
                
                setIsSubmitting(true);
                try {
                    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/auth/forgot-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to reset password');
                    }
                    
                    setIsForgotPassword(false);
                    setForgotPasswordStep(1);
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                        formRef.current?.reset();
                    }, 3000);
                } catch (error) {
                    FormUtils.showNotification(error.message, 'error', formRef.current);
                } finally {
                    setIsSubmitting(false);
                }
                return;
            }
        }

        const username = e.target.username.value.trim();
        const password = e.target.password.value.trim();

        // Validação de username e password
        if (!validateField('username', username) || !validateField('password', password)) return;

        // Se for sign up, valida também o email
        let email = '';
        if (isSignUp) {
            email = e.target.email.value.trim();
            if (!validateField('email', email)) return;
        }

        setIsSubmitting(true);
        
        try {
            const authResponse = await submitToApi({ username, email, password });
            login({user:authResponse.user, token: authResponse.token});
            setShowSuccess(true);
            navigate('/home');
            setTimeout(() => {
                setShowSuccess(false);
                formRef.current?.reset();
                setIsSignUp(false);
                setIsForgotPassword(false);
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
                    <h2>
                        {isForgotPassword ? 
                         (forgotPasswordStep === 1 ? 'Reset Password' : 'Set New Password') : 
                         isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p>
                        {isForgotPassword ? 
                         (forgotPasswordStep === 1 ? 'Enter your email address' : 'Enter your new password') :
                         isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
                    </p>
                </div>

                <form ref={formRef} className="login-form" onSubmit={handleSubmit} noValidate autoComplete="off">
                    {isForgotPassword ? (
                        forgotPasswordStep === 1 ? (
                            <>
                                {/* EMAIL PARA FORGOT PASSWORD */}
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <input type="email" id="email" name="email" required autoComplete="email"
                                            onBlur={e => validateField('email', e.target.value)} />
                                        <label htmlFor="email">Email Address</label>
                                        <span className="focus-border"></span>
                                    </div>
                                    <span className="error-message" id="emailError"></span>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* EMAIL (HIDDEN) PARA MANTER NO FORM */}
                                <input type="hidden" name="email" value={formRef.current?.querySelector('#email')?.value || ''} />
                                
                                {/* NEW PASSWORD */}
                                <div className="form-group">
                                    <div className="input-wrapper password-wrapper">
                                        <input type={showPassword ? 'text' : 'password'} id="password" name="password" required
                                            autoComplete="new-password"
                                            onBlur={e => validateField('password', e.target.value)} />
                                        <label htmlFor="password">New Password</label>
                                        <button type="button" className="password-toggle"
                                            onClick={() => setShowPassword(prev => !prev)}>
                                            <span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
                                        </button>
                                        <span className="focus-border"></span>
                                    </div>
                                    <span className="error-message" id="passwordError"></span>
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="form-group">
                                    <div className="input-wrapper password-wrapper">
                                        <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" required
                                            autoComplete="new-password"
                                            onBlur={e => validateField('confirmPassword', e.target.value, formRef.current)} />
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <button type="button" className="password-toggle"
                                            onClick={() => setShowPassword(prev => !prev)}>
                                            <span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
                                        </button>
                                        <span className="focus-border"></span>
                                    </div>
                                    <span className="error-message" id="confirmPasswordError"></span>
                                </div>
                            </>
                        )
                    ) : (
                        <>
                            {/* USER */}
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input type="text" id="username" name="username" required autoComplete="username"
                                        onBlur={e => validateField('username', e.target.value)} />
                                    <label htmlFor="username">User</label>
                                    <span className="focus-border"></span>
                                </div>
                                <span className="error-message" id="usernameError"></span>
                            </div>

                            {/* EMAIL */}
                            {isSignUp && (
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <input type="email" id="email" name="email" required autoComplete="email"
                                            onBlur={e => validateField('email', e.target.value)} />
                                        <label htmlFor="email">Email Address</label>
                                        <span className="focus-border"></span>
                                    </div>
                                    <span className="error-message" id="emailError"></span>
                                </div>
                            )}

                            {/* PASSWORD */}
                            <div className="form-group">
                                <div className="input-wrapper password-wrapper">
                                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" required
                                        autoComplete="current-password"
                                        onBlur={e => validateField('password', e.target.value)} />
                                    <label htmlFor="password">Password</label>
                                    <button type="button" className="password-toggle"
                                        onClick={() => setShowPassword(prev => !prev)}>
                                        <span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
                                    </button>
                                    <span className="focus-border"></span>
                                </div>
                                <span className="error-message" id="passwordError"></span>
                            </div>
                        </>
                    )}

                    {/* FORM OPTIONS SENHA - só mostra se não for forgot password */}
                    {!isForgotPassword && (
                        <div className="form-options">
                            <label className="remember-wrapper">
                                <input type="checkbox" id="remember" name="remember" />
                                <span className="checkbox-label">
                                    <span className="checkmark"></span>
                                    Remember me
                                </span>
                            </label>
                            <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); setForgotPasswordStep(1); }}>Forgot password?</a>
                        </div>
                    )}

                    <button type="submit" className={`login-btn btn ${isSubmitting ? 'loading' : ''}`}>
                        <span className="btn-text">
                            {isForgotPassword ? 
                             (forgotPasswordStep === 1 ? 'Continue' : 'Change Password') : 
                             isSignUp ? 'Sign Up' : 'Sign In'}
                        </span>
                        <span className="btn-loader"></span>
                    </button>
                </form>

                {/* SIGN UP LINK */}
                <div className="signup-link">
                    <p>
                        {isForgotPassword ? (
                            <>
                                {forgotPasswordStep === 1 ? (
                                    <>Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(false); setForgotPasswordStep(1); }}>Sign in</a></>
                                ) : (
                                    <>Wrong email? <a href="#" onClick={(e) => { e.preventDefault(); setForgotPasswordStep(1); }}>Go back</a></>
                                )}
                            </>
                        ) : isSignUp ? (
                            <>
                                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>Sign in</a>
                            </>
                        ) : (
                            <>
                                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}>Sign up</a>
                            </>
                        )}
                    </p>
                </div>

                {showSuccess && (
                    <div className="success-message show">
                        <div className="success-icon">✓</div>
                        <h3>
                            {isForgotPassword ? 'Password Changed!' : 'Login Successful!'}
                        </h3>
                        <p>
                            {isForgotPassword ? 'Now sign in with your new password' : 'Welcome back!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;