// Utilitários de formulário da página de login
const FormUtils = {
    validateEmail: (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(value);
        return { isValid, message: isValid ? '' : 'Invalid email address' };
    },

    validatePassword: (value) => {
        const isValid = value.length >= 6;
        return { isValid, message: isValid ? '' : 'Password must be at least 6 characters' };
    },

    validateUsername: (value) => {
        const isValid = value.trim() !== '';
        return { isValid, message: isValid ? '' : 'Username required' };
    },

    clearError: (fieldName) => {
        const errorEl = document.getElementById(`${fieldName}Error`);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
    },

    showError: (fieldName, message) => {
        const errorEl = document.getElementById(`${fieldName}Error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    },

    showSuccess: (fieldName) => FormUtils.clearError(fieldName),

    setupFloatingLabels: (form) => {
        if (!form) return;
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.toggle('has-value', !!input.value);
            });
        });
    },

    setupPasswordToggle: (passwordInput, toggleBtn) => {
        if (!passwordInput || !toggleBtn) return;
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleBtn.querySelector('.eye-icon')?.classList.toggle('show-password', isPassword);
        });
    },

    addEntranceAnimation: (element) => {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    },

    addSharedAnimations: () => {
        // Placeholder para futuras animações
    },

    showNotification: (message, type = 'info', container = null) => {
        // Cria uma notificação temporária usando Material-UI Snackbar
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'temp-notification';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.left = '50%';
        notificationContainer.style.transform = 'translateX(-50%)';
        notificationContainer.style.zIndex = '9999';

        // Estilos para a notificação
        const severityColors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };

        notificationContainer.innerHTML = `
            <div style="
                background: ${severityColors[type] || severityColors.info};
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                font-family: 'Roboto', sans-serif;
                font-size: 14px;
                max-width: 400px;
                text-align: center;
                animation: slideDown 0.3s ease-out;
            ">
                ${message}
            </div>
            <style>
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            </style>
        `;

        document.body.appendChild(notificationContainer);

        // Remove após 5 segundos
        setTimeout(() => {
            if (notificationContainer.parentNode) {
                notificationContainer.style.animation = 'slideDown 0.3s ease-in reverse';
                setTimeout(() => {
                    document.body.removeChild(notificationContainer);
                }, 300);
            }
        }, 5000);
    },

    simulateLogin: (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) resolve(true);
                else reject(new Error('Invalid credentials'));
            }, 1000);
        });
    },
};

export default FormUtils;