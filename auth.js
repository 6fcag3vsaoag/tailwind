const baseUrl = 'http://localhost:3000';
const form = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const generateUsernameBtn = document.getElementById('generateUsername');

// Список популярных паролей (TOP-100)
const commonPasswords = ['password123', '12345678', 'qwerty123', /* ... */];

// Функции валидации
const validators = {
    phone: (value) => {
        const phoneRegex = /^\+375(29|33|44|25)\d{7}$/;
        return phoneRegex.test(value) ? '' : 'Введите корректный номер телефона РБ';
    },
    
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Введите корректный email';
    },
    
    birthDate: (value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 16 ? '' : 'Вам должно быть 16 лет или больше';
    },
    
    password: (value) => {
        if (value.length < 8 || value.length > 20) {
            return 'Пароль должен содержать от 8 до 20 символов';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Пароль должен содержать заглавные буквы';
        }
        if (!/[a-z]/.test(value)) {
            return 'Пароль должен содержать строчные буквы';
        }
        if (!/\d/.test(value)) {
            return 'Пароль должен содержать цифры';
        }
        if (!/[!@#$%^&*]/.test(value)) {
            return 'Пароль должен содержать специальные символы (!@#$%^&*)';
        }
        if (commonPasswords.includes(value.toLowerCase())) {
            return 'Этот пароль слишком простой';
        }
        return '';
    },
    
    fullName: (value) => {
        const nameParts = value.trim().split(' ');
        return nameParts.length >= 2 ? '' : 'Введите имя и фамилию';
    },
    
    username: (value) => {
        return value.length >= 3 ? '' : 'Никнейм должен содержать минимум 3 символа';
    }
};

// Функция для генерации никнейма
async function generateUsername() {
    const adjectives = ['happy', 'sunny', 'bright', 'clever', 'swift'];
    const nouns = ['user', 'star', 'hero', 'genius', 'master'];
    let attempts = 0;
    
    while (attempts < 5) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const number = Math.floor(Math.random() * 1000);
        const username = `${adj}${noun}${number}`;
        
        try {
            const response = await fetch(`${baseUrl}/users?username=${username}`);
            const users = await response.json();
            
            if (users.length === 0) {
                document.getElementById('username').value = username;
                validateField('username', username);
                return;
            }
        } catch (error) {
            console.error('Error checking username:', error);
        }
        
        attempts++;
    }
    
    alert('Не удалось сгенерировать уникальный никнейм. Пожалуйста, введите его вручную.');
}

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
    const fields = ['phone', 'email', 'birthDate', 'password', 'fullName', 'username'];
    const terms = document.getElementById('terms').checked;
    
    const isValid = fields.every(field => {
        const value = document.getElementById(field).value;
        return validateField(field, value);
    }) && terms;
    
    submitBtn.disabled = !isValid;
}

// Обработчики событий
form.addEventListener('input', (e) => {
    if (e.target.id in validators) {
        validateField(e.target.id, e.target.value);
        validateForm();
    }
});

document.getElementById('terms').addEventListener('change', validateForm);

generateUsernameBtn.addEventListener('click', generateUsername);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = {
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        birthDate: document.getElementById('birthDate').value,
        password: document.getElementById('password').value,
        fullName: document.getElementById('fullName').value,
        username: document.getElementById('username').value,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Failed to register');
        
        alert('Регистрация успешна!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
    }
}); 