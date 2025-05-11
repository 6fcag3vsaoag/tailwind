const baseUrl = 'http://localhost:3000';
const form = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const generateUsernameBtn = document.getElementById('generateUsername');

// Список популярных паролей (TOP-100)
const commonPasswords = [
    'password123', '12345678', 'qwerty123', 'admin123', 'welcome1',
    'football', 'baseball', 'monkey123', 'letmein', 'shadow',
    'michael', 'mustang', '123456789', '1234567890', '1234567',
    'sunshine', 'princess', 'qwerty', 'admin', 'welcome',
    'solo', 'master', 'hello123', 'whatever', 'qazwsx',
    'trustno1', 'dragon', 'passw0rd', 'starwars', 'login',
    'abc123', '111111', '123123', 'admin1', 'qwerty123',
    '1q2w3e4r', '654321', '555555', 'lovely', '7777777',
    '888888', 'princess', 'dragon', 'password1', '123qwe',
    '666666', '1qaz2wsx', '123qwe', 'zxcvbnm', '121212',
    '000000', 'qazwsx', '123456', '12345678', 'abc123',
    'qwerty', 'monkey', 'letmein', 'dragon', '111111',
    'baseball', 'iloveyou', 'trustno1', 'sunshine', 'master',
    'welcome', 'shadow', 'ashley', 'football', 'jesus',
    'michael', 'ninja', 'mustang', 'password1', '1234567890',
    '1234567', '1234', 'pussy', '12345', 'dragon',
    'qwerty', '696969', 'shadow', 'melissa', 'superman',
    'qazwsx', 'mickey', 'mustang', '123456789', 'freedom',
    'whatever', 'qwertyuiop', '654321', '1qaz2wsx', '121212',
    '000000', 'qazwsx', '123456', '12345678', 'abc123'
];

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
        let age = today.getFullYear() - birthDate.getFullYear();
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

    confirmPassword: (value) => {
        const password = document.getElementById('password').value;
        return value === password ? '' : 'Пароли не совпадают';
    },
    
    lastName: (value) => {
        return value.trim().length >= 2 ? '' : 'Введите корректную фамилию';
    },
    
    firstName: (value) => {
        return value.trim().length >= 2 ? '' : 'Введите корректное имя';
    },
    
    middleName: (value) => {
        return value.trim().length === 0 || value.trim().length >= 2 ? '' : 'Введите корректное отчество';
    },
    
    username: (value) => {
        return value.length >= 3 ? '' : 'Никнейм должен содержать минимум 3 символа';
    }
};

// Функция для генерации никнейма
async function generateUsername() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    let attempts = 0;
    
    while (attempts < 5) {
        // Генерируем никнейм по алгоритму
        const firstPart = firstName.slice(0, Math.min(3, firstName.length));
        const lastPart = lastName.slice(0, Math.min(3, lastName.length));
        const number = Math.floor(Math.random() * 890) + 110; // Число от 110 до 999
        const username = `${firstPart}${lastPart}${number}`;
        
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
    const fields = ['phone', 'email', 'birthDate', 'password', 'confirmPassword', 
                   'lastName', 'firstName', 'username'];
    const terms = document.getElementById('terms').checked;
    
    const isValid = fields.every(field => {
        const value = document.getElementById(field).value;
        return validateField(field, value);
    }) && terms;
    
    submitBtn.disabled = !isValid;
    return isValid;
}

// Инициализация обработчиков событий только если мы на странице авторизации
if (form) {
    // Обработчики событий
    form.addEventListener('input', (e) => {
        if (e.target.id in validators) {
            validateField(e.target.id, e.target.value);
            validateForm();
        }
    });

    if (document.getElementById('terms')) {
        document.getElementById('terms').addEventListener('change', validateForm);
    }

    if (generateUsernameBtn) {
        generateUsernameBtn.addEventListener('click', generateUsername);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const formData = {
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            birthDate: document.getElementById('birthDate').value,
            password: document.getElementById('password').value,
            lastName: document.getElementById('lastName').value,
            firstName: document.getElementById('firstName').value,
            middleName: document.getElementById('middleName').value,
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
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to register');
            }
            
            alert('Регистрация успешна!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            alert('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
        }
    });
} 