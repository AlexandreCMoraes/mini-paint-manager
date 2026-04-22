import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
import FormUtils from '../../utils/form-utils'; // Importa as funções utilitárias para o formulário
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

    const validateField = (fieldName, value) => {
        const validators = {
            username: FormUtils.validateUsername,
            email: FormUtils.validateEmail,
            password: FormUtils.validatePassword
        };
        const result = validators[fieldName](value);
        result.isValid ? FormUtils.showSuccess(fieldName) : FormUtils.showError(fieldName, result.message);
        return result.isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const username = e.target.username.value.trim();
        const password = e.target.password.value.trim();

        // Validação de username e password
        if (!validateField('username', username) || !validateField('password', password)) return;

        // Se for sign up, valida também o email
        if (isSignUp) {
            const email = e.target.email.value.trim();
            if (!validateField('email', email)) return;
        } else {
            const email = e.target.email?.value?.trim() || username + '@email.com';
        }

        setIsSubmitting(true);
        try {
            const email = isSignUp ? e.target.email.value.trim() : username + '@email.com';
            await FormUtils.simulateLogin(email, password);
            setShowSuccess(true);
            navigate('/home');
            login({ email });
            setTimeout(() => {
                setShowSuccess(false);
                formRef.current?.reset();
                setIsSignUp(false);
            }, 5000);
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
                    <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                    <p>{isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}</p>
                </div>

                <form ref={formRef} className="login-form" onSubmit={handleSubmit} noValidate autoComplete="off">
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
                    {/* FORM OPTIONS SENHA */}
                    <div className="form-options">
                        <label className="remember-wrapper">
                            <input type="checkbox" id="remember" name="remember" />
                            <span className="checkbox-label">
                                <span className="checkmark"></span>
                                Remember me
                            </span>
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className={`login-btn btn ${isSubmitting ? 'loading' : ''}`}>
                        <span className="btn-text">{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                        <span className="btn-loader"></span>
                    </button>
                </form>

                {/* SIGN UP LINK */}
                <div className="signup-link">
                    <p>
                        {isSignUp ? (
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
                        <h3>Login Successful!</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;