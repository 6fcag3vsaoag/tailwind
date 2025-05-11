const baseUrl = 'http://localhost:3000';

// DOM элементы
const dishesTab = document.getElementById('dishesTab');
const feedbackTab = document.getElementById('feedbackTab');
const dishesSection = document.getElementById('dishesSection');
const feedbackSection = document.getElementById('feedbackSection');
const dishForm = document.getElementById('dishForm');
const dishesList = document.getElementById('dishesList');
const adminFeedbackList = document.getElementById('adminFeedbackList');
const logoutButton = document.getElementById('logoutButton');

// Получение токена из localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Проверка, является ли пользователь администратором
function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin' && getToken();
}

// Переключение между вкладками
dishesTab.addEventListener('click', () => {
    dishesTab.classList.add('border-yellow-500', 'text-gray-900');
    dishesTab.classList.remove('border-transparent', 'text-gray-500');
    feedbackTab.classList.add('border-transparent', 'text-gray-500');
    feedbackTab.classList.remove('border-yellow-500', 'text-gray-900');
    dishesSection.classList.remove('hidden');
    feedbackSection.classList.add('hidden');
});

feedbackTab.addEventListener('click', () => {
    feedbackTab.classList.add('border-yellow-500', 'text-gray-900');
    feedbackTab.classList.remove('border-transparent', 'text-gray-500');
    dishesTab.classList.add('border-transparent', 'text-gray-500');
    dishesTab.classList.remove('border-yellow-500', 'text-gray-900');
    feedbackSection.classList.remove('hidden');
    dishesSection.classList.add('hidden');
    loadFeedback();
});

// Выход из системы
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Загрузка списка товаров с повторными попытками
async function loadDishes(maxRetries = 3) {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('Токен отсутствует');
            }
            const response = await fetch(`${baseUrl}/dishes?_limit=100`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
            }
            const dishes = await response.json();
            
            // Проверяем, что все товары имеют необходимые поля
            const validDishes = dishes.filter(dish => 
                dish.id && 
                dish.name && 
                dish.category && 
                dish.price && 
                dish.image
            );
            
            if (validDishes.length !== dishes.length) {
                console.warn(`Найдено ${dishes.length - validDishes.length} некорректных товаров в базе`);
            }
            
            dishesList.innerHTML = validDishes.map(dish => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-4">
                        <img src="${dish.image}" alt="${dish.name}" class="w-16 h-16 object-cover rounded-lg" onerror="this.src='images/placeholder.png'">
                        <div>
                            <h3 class="font-medium">${dish.name}</h3>
                            <p class="text-sm text-gray-500">${dish.category}</p>
                            <p class="text-sm font-medium">${dish.price} ₽</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editDish(${dish.id})" class="text-yellow-600 hover:text-yellow-700">
                            Редактировать
                        </button>
                        <button onclick="deleteDish(${dish.id})" class="text-red-600 hover:text-red-700">
                            Удалить
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Если нет товаров, показываем сообщение
            if (validDishes.length === 0) {
                dishesList.innerHTML = '<p class="text-gray-500">Товары отсутствуют</p>';
            }
            
            return; // Успешно загрузили, выходим
        } catch (error) {
            attempts++;
            console.error(`Попытка ${attempts}/${maxRetries} загрузки товаров не удалась:`, error);
            if (attempts === maxRetries) {
                console.error('Все попытки загрузки товаров исчерпаны:', error);
                alert('Не удалось загрузить список товаров');
                dishesList.innerHTML = '<p class="text-red-500">Ошибка загрузки товаров</p>';
            } else {
                // Ждем перед повторной попыткой
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
}

// Добавление нового товара
dishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = getToken();
    if (!token) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }
    
    const formData = new FormData(dishForm);
    
    try {
        const response = await fetch(`${baseUrl}/dishes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (response.ok) {
            alert('Товар успешно добавлен');
            dishForm.reset();
            // Даем серверу время завершить запись в db.json
            setTimeout(() => loadDishes(), 500);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при добавлении товара');
        }
    } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
        alert(`Не удалось добавить товар: ${error.message}`);
    }
});

// Редактирование товара
async function editDish(id) {
    try {
        const token = getToken();
        if (!token) {
            alert('Пожалуйста, войдите в систему');
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${baseUrl}/dishes/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных товара');
        }
        const dish = await response.json();
        
        // Заполняем форму данными товара
        document.getElementById('dishName').value = dish.name;
        document.getElementById('dishDescription').value = dish.description;
        document.getElementById('dishPrice').value = dish.price;
        document.getElementById('dishCategory').value = dish.category;
        // Поле файла не заполняем, так как это файл
        
        // Изменяем обработчик отправки формы
        const originalSubmitHandler = dishForm.onsubmit;
        dishForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const formData = new FormData(dishForm);
            
            try {
                const response = await fetch(`${baseUrl}/dishes/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (response.ok) {
                    alert('Товар успешно обновлен');
                    dishForm.reset();
                    dishForm.onsubmit = originalSubmitHandler;
                    setTimeout(() => loadDishes(), 500); // Задержка для обновления
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Ошибка при обновлении товара');
                }
            } catch (error) {
                console.error('Ошибка при обновлении товара:', error);
                alert(`Не удалось обновить товар: ${error.message}`);
            }
        };
    } catch (error) {
        console.error('Ошибка при загрузке данных товара:', error);
        alert('Не удалось загрузить данные товара');
    }
}

// Удаление товара
async function deleteDish(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }
    
    const token = getToken();
    if (!token) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${baseUrl}/dishes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Товар успешно удален');
            setTimeout(() => loadDishes(), 500); // Задержка для обновления
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при удалении товара');
        }
    } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        alert(`Не удалось удалить товар: ${error.message}`);
    }
}

// Загрузка отзывов
async function loadFeedback() {
    try {
        const token = getToken();
        if (!token) {
            alert('Пожалуйста, войдите в систему');
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${baseUrl}/feedback`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка при загрузке отзывов');
        }
        const feedback = await response.json();
        
        // Получение информации о блюдах
        const dishesResponse = await fetch(`${baseUrl}/dishes?_limit=100`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!dishesResponse.ok) {
            throw new Error('Ошибка при загрузке блюд');
        }
        const dishes = await dishesResponse.json();
        const dishesMap = new Map(dishes.map(d => [d.id, d]));
        
        adminFeedbackList.innerHTML = feedback.map(f => {
            const dish = dishesMap.get(f.dishId);
            return `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium">${dish ? dish.name : 'Блюдо не найдено'}</h3>
                            <div class="flex items-center space-x-2 mt-1">
                                ${Array(5).fill().map((_, i) => `
                                    <svg class="w-4 h-4 ${i < f.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                `).join('')}
                            </div>
                            <p class="mt-2 text-sm text-gray-600">${f.comment}</p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="deleteFeedback(${f.id})" class="text-red-600 hover:text-red-700">
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Если нет отзывов, показываем сообщение
        if (feedback.length === 0) {
            adminFeedbackList.innerHTML = '<p class="text-gray-500">Отзывы отсутствуют</p>';
        }
    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        alert('Не удалось загрузить отзывы');
        adminFeedbackList.innerHTML = '<p class="text-red-500">Ошибка загрузки отзывов</p>';
    }
}

// Удаление отзыва
async function deleteFeedback(id) {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        return;
    }
    
    const token = getToken();
    if (!token) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${baseUrl}/feedback/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Отзыв успешно удален');
            loadFeedback();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при удалении отзыва');
        }
    } catch (error) {
        console.error('Ошибка при удалении отзыва:', error);
        alert(`Не удалось удалить отзыв: ${error.message}`);
    }
}

// Проверка доступа при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!isAdmin()) {
        alert('Пожалуйста, войдите как администратор');
        window.location.href = 'login.html';
    } else {
        loadDishes();
    }
});