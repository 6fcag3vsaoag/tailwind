const baseUrl = 'http://localhost:3000';
const form = document.getElementById('feedbackForm');
const submitBtn = document.getElementById('submitBtn');
const dishSelect = document.getElementById('dishSelect');
const feedbackList = document.getElementById('feedbackList');

// Загрузка купленных блюд
async function loadPurchasedDishes() {
    try {
        const response = await fetch(`${baseUrl}/orders`);
        const orders = await response.json();
        
        // Получаем уникальные ID блюд из заказов
        const purchasedDishIds = [...new Set(orders.flatMap(order => 
            order.items.map(item => item.dishId)
        ))];
        
        // Получаем информацию о блюдах
        const dishesResponse = await fetch(`${baseUrl}/dishes`);
        const dishes = await dishesResponse.json();
        
        // Фильтруем только купленные блюда
        const purchasedDishes = dishes.filter(dish => 
            purchasedDishIds.includes(dish.id)
        );
        
        // Заполняем select
        dishSelect.innerHTML = '<option value="">Выберите блюдо</option>' +
            purchasedDishes.map(dish => 
                `<option value="${dish.id}">${dish.name}</option>`
            ).join('');
    } catch (error) {
        console.error('Error loading purchased dishes:', error);
    }
}

// Загрузка отзывов
async function loadFeedback() {
    try {
        const response = await fetch(`${baseUrl}/feedback`);
        const feedback = await response.json();
        
        // Получаем информацию о блюдах
        const dishesResponse = await fetch(`${baseUrl}/dishes`);
        const dishes = await dishesResponse.json();
        
        // Отображаем отзывы
        feedbackList.innerHTML = feedback.map(item => {
            const dish = dishes.find(d => d.id === item.dishId);
            return `
                <div class="bg-white shadow-lg rounded-lg p-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-semibold">${dish ? dish.name : 'Блюдо не найдено'}</h3>
                            <div class="flex items-center mt-2">
                                ${Array(5).fill().map((_, i) => `
                                    <svg class="w-5 h-5 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}" 
                                         fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                `).join('')}
                            </div>
                        </div>
                        <span class="text-sm text-gray-500">
                            ${new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p class="mt-4 text-gray-600">${item.comment}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

// Валидация формы
function validateForm() {
    const dishId = dishSelect.value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;
    const commentError = document.getElementById('commentError');
    
    let isValid = true;
    
    if (!dishId) {
        isValid = false;
    }
    
    if (!rating) {
        isValid = false;
    }
    
    if (comment.length < 10) {
        commentError.textContent = 'Комментарий должен содержать минимум 10 символов';
        commentError.classList.remove('hidden');
        isValid = false;
    } else {
        commentError.classList.add('hidden');
    }
    
    submitBtn.disabled = !isValid;
}

// Обработчики событий
document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const rating = btn.dataset.rating;
        document.getElementById('rating').value = rating;
        
        // Обновляем стили кнопок
        document.querySelectorAll('.rating-btn').forEach(b => {
            b.classList.remove('bg-yellow-500', 'text-white');
            b.classList.add('bg-gray-100', 'text-gray-700');
        });
        
        document.querySelectorAll('.rating-btn').forEach(b => {
            if (b.dataset.rating <= rating) {
                b.classList.remove('bg-gray-100', 'text-gray-700');
                b.classList.add('bg-yellow-500', 'text-white');
            }
        });
        
        validateForm();
    });
});

form.addEventListener('input', validateForm);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = {
        dishId: parseInt(dishSelect.value),
        rating: parseInt(document.getElementById('rating').value),
        comment: document.getElementById('comment').value,
        createdAt: new Date().toISOString(),
        isApproved: true
    };
    
    try {
        const response = await fetch(`${baseUrl}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Failed to submit feedback');
        
        alert('Отзыв успешно добавлен!');
        form.reset();
        document.getElementById('rating').value = '';
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.classList.remove('bg-yellow-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        validateForm();
        loadFeedback();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.');
    }
});

// Инициализация
loadPurchasedDishes();
loadFeedback(); 