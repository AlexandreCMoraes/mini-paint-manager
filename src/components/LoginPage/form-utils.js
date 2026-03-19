const FormUtils = {
    validateEmail: (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(value);
        return {
            isValid,
            message: isValid ? '' : 'Invalid email address',
        };
    },

    validatePassword: (value) => {
        const isValid = value.length >= 6;
        return {
            isValid,
            message: isValid ? '' : 'Password must be at least 6 characters',
        };
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

    showSuccess: (fieldName) => {
        const errorEl = document.getElementById(`${fieldName}Error`);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
    },

    setupFloatingLabels: (form) => {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    },

    setupPasswordToggle: (passwordInput, toggleBtn) => {
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.querySelector('.eye-icon').classList.add('show-password');
            } else {
                passwordInput.type = 'password';
                toggleBtn.querySelector('.eye-icon').classList.remove('show-password');
            }
        });
    },

    addEntranceAnimation: (element) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }
    },

    showNotification: (message, type, container) => {
        alert(`${type.toUpperCase()}: ${message}`);
    },

    simulateLogin: (email, password) => {
        // Mock login: any email/password accepted after 1s
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) resolve(true);
                else reject(new Error('Invalid credentials'));
            }, 1000);
        });
    },

    addSharedAnimations: () => {
        // Placeholder if quiser adicionar mais animações
    },
};

export default FormUtils;