// src/components/Login/Login.js
import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
import FormUtils from './form-utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente de Login que é a página de login do sistema, onde o usuário pode inserir suas 
// credenciais para acessar o sistema. Ele utiliza o contexto de autenticação para gerenciar o 
// estado do usuário e redirecionar para a página principal do sistema após um login bem-sucedido. 
// O componente também inclui validação de formulário, animações e feedback visual para melhorar a 
// experiência do usuário.
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();


    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // useEffect para configurar as animações de entrada, os rótulos flutuantes e o toggle de senha
    useEffect(() => {
        FormUtils.addEntranceAnimation(document.querySelector('.login-card'));
        FormUtils.setupFloatingLabels(formRef.current);
        FormUtils.setupPasswordToggle(
            document.getElementById('password'),
            document.getElementById('passwordToggle')
        );
        FormUtils.addSharedAnimations();
    }, []);

    // useEffect para inicializar o Google Identity Services e renderizar o botão de login do Google.
    // useEffect(() => {
    //     // Inicializa o Google Identity Services
    //     if (window.google) {
    //         window.google.accounts.id.initialize({
    //             client_id: "SEU_CLIENT_ID_GOOGLE.apps.googleusercontent.com", // ALTERAÇÃO: coloque seu client ID
    //             callback: handleGoogleResponse,
    //         });
    //         window.google.accounts.id.renderButton(
    //             document.getElementById("googleSignInDiv"),
    //             { theme: "outline", size: "large" }
    //         );
    //     }
    // }, []);

    useEffect(() => {
        // Espera até window.google existir
        const interval = setInterval(() => {
            if (window.google) {
                clearInterval(interval);

                window.google.accounts.id.initialize({
                    client_id: "SEU_CLIENT_ID_GOOGLE.apps.googleusercontent.com", // coloque seu Client ID
                    callback: handleGoogleResponse,
                });

                // window.google.accounts.id.renderButton(
                //     document.getElementById("googleSignInDiv"),
                //     { theme: "outline", size: "large" }
                // );
            }
        }, 100);
    }, []);


    // Função que inicia o login do Google quando o botão estilizado é clicado
    const handleGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.prompt(); // abre o popup do Google
        } else {
            console.error("Google Identity Services não carregou ainda");
        }
    };

    // Função para validar os campos do formulário usando as funções de validação do FormUtils. 
    // Ela é chamada tanto no evento onBlur dos inputs quanto na submissão do formulário para garantir 
    // que os dados sejam válidos antes de tentar fazer o login.
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
    // Função para lidar com a submissão do formulário de login. Ela valida os campos, 
    // simula um processo de login,
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
            login({ email }); // Atualiza o contexto de autenticação
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

    // Callback quando o usuário loga com Google
    const handleGoogleResponse = (response) => {
        const decodedUser = JSON.parse(atob(response.credential.split('.')[1]));
        console.log("Google User:", decodedUser); // só para conferir no console

        login({ email: decodedUser.email, name: decodedUser.name }); // Atualiza contexto
        navigate('/miniaturas'); // Redireciona para a página principal
    };

    // O componente retorna a estrutura JSX do formulário de login, incluindo os campos de email e senha,
    // botões de login e opções de login social, além de mensagens de erro e sucesso para feedback visual.
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
                {/* Botao estilizado */}
                <div className="social-login">
                    {/* <button type="button" className="social-btn google-btn"
                        onClick={handleGoogleLogin}>
                        <span className="social-icon google-icon"></span>
                        Google
                    </button> */}

                    {/* Google Sign-In será renderizado aqui */}
                    {/* <div id="googleSignInDiv"></div> */}
                    {/* ALTERAÇÃO: o botão oficial do Google será inserido aqui */}

                    {/* <button type="button" className="social-btn github-btn">
                        <span className="social-icon github-icon"></span>
                        GitHub
                    </button> */}
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