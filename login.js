const baseUrl = 'http://localhost:3000';
const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');

// Функции валидации
const validators = {
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Введите корректный email';
    },
    
    password: (value) => {
        return value.length >= 8 ? '' : 'Пароль должен содержать минимум 8 символов';
    }
};

// Функция валидации поля
function validateField(fieldName, value) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const error = validators[fieldName](value);
    
    if (error) {
        errorElement.textContent = error;
        errorElement.classList.remove('hidden');
        return false;
    } else {
        errorElement.classList.add('hidden');
        return true;
    }
}

// Функция проверки всей формы
function validateForm() {
    const fields = ['email', 'password'];
    return fields.every(field => {
        const value = document.getElementById(field).value;
        return validateField(field, value);
    });
}

// Обработчики событий
form.addEventListener('input', (e) => {
    if (e.target.id in validators) {
        validateField(e.target.id, e.target.value);
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка входа');
        }
        
        // Сохраняем токен в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Перенаправляем на страницу профиля
        window.location.href = 'profile.html';
    } catch (error) {
        console.error('Ошибка при входе:', error);
        const errorElement = document.getElementById('passwordError');
        errorElement.textContent = 'Неверный email или пароль';
        errorElement.classList.remove('hidden');
    }
}); 