const baseUrl = 'http://localhost:3000';
const form = document.getElementById('profileForm');
const submitBtn = document.getElementById('submitBtn');

// Проверка авторизации
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Заполняем форму данными пользователя
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('middleName').value = user.middleName || '';
    document.getElementById('username').value = user.username || '';
}

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
    const fields = ['phone', 'email', 'lastName', 'firstName', 'username'];
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
    
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    const formData = {
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        username: document.getElementById('username').value
    };
    
    try {
        const response = await fetch(`${baseUrl}/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка обновления профиля');
        }
        
        // Обновляем данные пользователя в localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert('Профиль успешно обновлен!');
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        alert('Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте позже.');
    }
});

// Проверяем авторизацию при загрузке страницы
checkAuth(); 