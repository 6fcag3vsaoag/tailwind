const baseUrl = 'http://localhost:3000';

// DOM элементы
const dishesTab = document.getElementById('dishesTab');
const feedbackTab = document.getElementById('feedbackTab');
const dishesSection = document.getElementById('dishesSection');
const feedbackSection = document.getElementById('feedbackSection');
const dishForm = document.getElementById('dishForm');
const dishesList = document.getElementById('dishesList');
const feedbackFilter = document.getElementById('feedbackFilter');
const adminFeedbackList = document.getElementById('adminFeedbackList');

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

// Загрузка списка товаров
async function loadDishes() {
    try {
        const response = await fetch(`${baseUrl}/dishes`);
        const dishes = await response.json();
        
        dishesList.innerHTML = dishes.map(dish => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-4">
                    <img src="${dish.image}" alt="${dish.name}" class="w-16 h-16 object-cover rounded-lg">
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
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        alert('Не удалось загрузить список товаров');
    }
}

// Добавление нового товара
dishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(dishForm);
    const dishData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        image: formData.get('image')
    };
    
    try {
        const response = await fetch(`${baseUrl}/dishes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dishData)
        });
        
        if (response.ok) {
            alert('Товар успешно добавлен');
            dishForm.reset();
            loadDishes();
        } else {
            throw new Error('Ошибка при добавлении товара');
        }
    } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
        alert('Не удалось добавить товар');
    }
});

// Редактирование товара
async function editDish(id) {
    try {
        const response = await fetch(`${baseUrl}/dishes/${id}`);
        const dish = await response.json();
        
        // Заполняем форму данными товара
        document.getElementById('dishName').value = dish.name;
        document.getElementById('dishDescription').value = dish.description;
        document.getElementById('dishPrice').value = dish.price;
        document.getElementById('dishCategory').value = dish.category;
        document.getElementById('dishImage').value = dish.image;
        
        // Изменяем обработчик отправки формы
        const originalSubmitHandler = dishForm.onsubmit;
        dishForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const formData = new FormData(dishForm);
            const updatedDish = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                image: formData.get('image')
            };
            
            try {
                const response = await fetch(`${baseUrl}/dishes/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedDish)
                });
                
                if (response.ok) {
                    alert('Товар успешно обновлен');
                    dishForm.reset();
                    dishForm.onsubmit = originalSubmitHandler;
                    loadDishes();
                } else {
                    throw new Error('Ошибка при обновлении товара');
                }
            } catch (error) {
                console.error('Ошибка при обновлении товара:', error);
                alert('Не удалось обновить товар');
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
    
    try {
        const response = await fetch(`${baseUrl}/dishes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Товар успешно удален');
            loadDishes();
        } else {
            throw new Error('Ошибка при удалении товара');
        }
    } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        alert('Не удалось удалить товар');
    }
}

// Загрузка отзывов
async function loadFeedback() {
    try {
        const response = await fetch(`${baseUrl}/feedback`);
        const feedback = await response.json();
        
        // Фильтрация отзывов
        const filter = feedbackFilter.value;
        const filteredFeedback = filter === 'all' 
            ? feedback 
            : feedback.filter(f => f.status === filter);
        
        // Получение информации о блюдах
        const dishesResponse = await fetch(`${baseUrl}/dishes`);
        const dishes = await dishesResponse.json();
        const dishesMap = new Map(dishes.map(d => [d.id, d]));
        
        adminFeedbackList.innerHTML = filteredFeedback.map(f => {
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
                            ${f.status === 'pending' ? `
                                <button onclick="updateFeedbackStatus(${f.id}, 'approved')" class="text-green-600 hover:text-green-700">
                                    Одобрить
                                </button>
                                <button onclick="updateFeedbackStatus(${f.id}, 'rejected')" class="text-red-600 hover:text-red-700">
                                    Отклонить
                                </button>
                            ` : ''}
                            <button onclick="deleteFeedback(${f.id})" class="text-red-600 hover:text-red-700">
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        alert('Не удалось загрузить отзывы');
    }
}

// Обновление статуса отзыва
async function updateFeedbackStatus(id, status) {
    try {
        const response = await fetch(`${baseUrl}/feedback/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Статус отзыва успешно обновлен');
            loadFeedback();
        } else {
            throw new Error('Ошибка при обновлении статуса отзыва');
        }
    } catch (error) {
        console.error('Ошибка при обновлении статуса отзыва:', error);
        alert('Не удалось обновить статус отзыва');
    }
}

// Удаление отзыва
async function deleteFeedback(id) {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        return;
    }
    
    try {
        const response = await fetch(`${baseUrl}/feedback/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Отзыв успешно удален');
            loadFeedback();
        } else {
            throw new Error('Ошибка при удалении отзыва');
        }
    } catch (error) {
        console.error('Ошибка при удалении отзыва:', error);
        alert('Не удалось удалить отзыв');
    }
}

// Обработчик изменения фильтра отзывов
feedbackFilter.addEventListener('change', loadFeedback);

// Загрузка начальных данных
loadDishes(); 