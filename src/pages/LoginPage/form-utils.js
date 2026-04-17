// src/components/Login/form-utils.js
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
        alert(`${type.toUpperCase()}: ${message}`);
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