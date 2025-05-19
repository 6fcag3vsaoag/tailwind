const cartContainer = document.getElementById('cart-container');
const cartHeader = document.getElementById('cart-header');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const baseUrl = 'http://localhost:3000';

// Флаг для отслеживания активных запросов
let isUpdating = false;

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!window.auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    loadCart();
});

// Функция для проверки, находится ли товар в избранном
async function isDishFavorite(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            return false;
        }

        const response = await fetch(`${window.baseUrl}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return false;
        }

        const favorites = await response.json();
        return favorites.some(fav => fav.id === dishId);
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
}

// Загрузка корзины
async function loadCart() {
    try {
        const token = window.auth.getToken();
        console.log('Токен авторизации:', token);
        
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cartItems = await response.json();
        console.log('Получены товары корзины:', JSON.stringify(cartItems, null, 2));
        
        if (cartItems.length === 0) {
            cartContainer.innerHTML = '<div class="col-span-full text-center text-gray-500">Корзина пуста</div>';
            totalPriceElement.textContent = '';
            return;
        }

        // Получаем информацию о каждом блюде
        const itemsWithDetails = await Promise.all(
            cartItems.map(async (item) => {
                try {
                    console.log('Обработка элемента корзины:', JSON.stringify(item, null, 2));
                    
                    const dishId = item.id;
                    if (!dishId) {
                        console.error('id отсутствует в элементе корзины:', item);
                        return null;
                    }

                    console.log(`Запрос информации о блюде ${dishId}`);
                    const dishResponse = await fetch(`${window.baseUrl}/dishes/${dishId}`);
                    if (!dishResponse.ok) {
                        console.error(`Ошибка при получении блюда ${dishId}:`, dishResponse.status);
                        return null;
                    }
                    const dish = await dishResponse.json();
                    console.log(`Получена информация о блюде ${dishId}:`, JSON.stringify(dish, null, 2));
                    
                    // Проверяем, есть ли товар в избранном
                    const isFavorite = await isDishFavorite(dishId);
                    
                    return {
                        ...dish,
                        quantity: item.quantity,
                        isFavorite
                    };
                } catch (error) {
                    console.error(`Ошибка при обработке блюда ${item.id}:`, error);
                    return null;
                }
            })
        );

        // Фильтруем null значения
        const validItems = itemsWithDetails.filter(item => item !== null);
        console.log('Валидные элементы после обработки:', JSON.stringify(validItems, null, 2));
        
        if (validItems.length === 0) {
            cartContainer.innerHTML = '<div class="col-span-full text-center text-red-500">Ошибка при загрузке товаров</div>';
            return;
        }
        
        let totalPrice = 0;
        cartContainer.innerHTML = validItems.map(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const card = createProductCard(item, item.isFavorite);
            // Обновляем количество в карточке
            const quantityElement = document.getElementById(`quantity-${item.id}`);
            if (quantityElement) {
                quantityElement.textContent = item.quantity;
            }
            return card;
        }).join('');
        
        totalPriceElement.textContent = `Итого: €${totalPrice.toFixed(2)}`;
    } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
        cartContainer.innerHTML = '<div class="col-span-full text-center text-red-500">Ошибка при загрузке корзины</div>';
    }
}

// Обновление количества товара
async function updateQuantity(dishId, newQuantity) {
    if (!dishId) {
        console.error('ID товара не определен');
        return;
    }

    if (isUpdating) {
        console.log('Обновление уже выполняется, пропускаем запрос');
        return;
    }

    try {
        isUpdating = true;
        const token = window.auth.getToken();
        if (!token) {
            throw new Error('No token found');
        }

        if (newQuantity <= 0) {
            await removeFromCart(dishId);
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${window.baseUrl}/cart/${dishId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQuantity }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        await loadCart();
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при обновлении количества:', error);
        alert('Ошибка при обновлении количества: ' + error.message);
    } finally {
        isUpdating = false;
    }
}

// Удаление из корзины
async function removeFromCart(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${window.baseUrl}/cart/${dishId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showNotification('Товар удален из корзины', 'cart');
        // Добавляем задержку перед обновлением
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loadCart();
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при удалении из корзины:', error);
        showNotification('Ошибка при удалении товара', 'error');
    }
}

// Функция для создания модального окна подтверждения удаления
function createDeleteConfirmationModal(itemName) {
    return `
    <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
        <p class="text-gray-600 mb-6">Вы уверены, что хотите удалить "${itemName}" из корзины?</p>
        <div class="flex justify-center space-x-4">
            <button onclick="hideModal()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Отмена
            </button>
            <button onclick="confirmDelete()" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Удалить
            </button>
        </div>
    </div>`;
}

// Функция для создания модального окна оформления заказа
function createCheckoutModal(cartItems, totalAmount) {
    return `
    <div class="space-y-6">
        <h3 class="text-lg font-medium text-gray-900">Оформление заказа</h3>
        <div class="space-y-4">
            <div class="border-t border-b py-4">
                <h4 class="font-medium text-gray-900 mb-2">Ваш заказ:</h4>
                <div class="space-y-2">
                    ${cartItems.map(item => `
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">${item.name} x ${item.quantity}</span>
                            <span class="text-gray-900">€${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="flex justify-between items-center font-medium">
                <span>Итого:</span>
                <span class="text-yellow-500">€${totalAmount.toFixed(2)}</span>
            </div>
        </div>
        <div class="flex justify-end space-x-4">
            <button onclick="hideModal()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Отмена
            </button>
            <button onclick="confirmCheckout()" class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                Подтвердить заказ
            </button>
        </div>
    </div>`;
}

// Глобальные переменные для хранения данных между модальными окнами
let currentDeleteItemId = null;
let currentCheckoutData = null;

// Функция для отображения модального окна подтверждения удаления
function showDeleteConfirmation(itemId, itemName) {
    currentDeleteItemId = itemId;
    const modalContent = createDeleteConfirmationModal(itemName);
    showModal(modalContent, 'Удаление товара');
}

// Функция для подтверждения удаления
async function confirmDelete() {
    if (!currentDeleteItemId) return;
    
    try {
        await removeFromCart(currentDeleteItemId);
        hideModal();
        showNotification('Товар успешно удален из корзины', 'success');
    } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        showNotification('Ошибка при удалении товара', 'error');
    } finally {
        currentDeleteItemId = null;
    }
}

// Функция для отображения модального окна оформления заказа
async function showCheckoutModal() {
    try {
        const cartItems = await fetchCart();
        if (cartItems.length === 0) {
            showNotification('Корзина пуста', 'warning');
            return;
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        currentCheckoutData = { cartItems, totalAmount };
        
        const modalContent = createCheckoutModal(cartItems, totalAmount);
        showModal(modalContent, 'Оформление заказа');
    } catch (error) {
        console.error('Ошибка при подготовке оформления заказа:', error);
        showNotification('Ошибка при подготовке оформления заказа', 'error');
    }
}

// Функция для подтверждения оформления заказа
async function confirmCheckout() {
    if (!currentCheckoutData) return;
    
    try {
        const { cartItems, totalAmount } = currentCheckoutData;
        const token = window.auth.getToken();
        
        if (!token) {
            throw new Error('Требуется авторизация');
        }

        console.log('Начало оформления заказа:', { cartItems, totalAmount });

        const orderData = {
            items: cartItems.map(item => ({
                dishId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            status: 'completed',
            createdAt: new Date().toISOString()
        };

        console.log('Отправка данных заказа:', orderData);

        const response = await fetch(`${window.baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка при создании заказа:', response.status, errorText);
            throw new Error(`Ошибка при создании заказа: ${response.status}, ${errorText}`);
        }

        console.log('Заказ успешно создан');

        // Очищаем корзину
        console.log('Начало очистки корзины');
        for (const item of cartItems) {
            try {
                await removeFromCart(item.id);
                console.log(`Товар ${item.id} удален из корзины`);
            } catch (error) {
                console.error(`Ошибка при удалении товара ${item.id} из корзины:`, error);
            }
        }
        
        hideModal();
        showNotification('Заказ успешно оформлен', 'success');
        await loadCart();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        showNotification('Ошибка при оформлении заказа', 'error');
    } finally {
        currentCheckoutData = null;
    }
}

// Обновление количества товаров в корзине (без зависимости от cart-count)
async function updateCartCount() {
    try {
        const token = window.auth.getToken();
        if (!token) {
            console.log('Токен отсутствует, обновление счетчика корзины пропущено');
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        // Получаем данные корзины, но не обновляем DOM, если cart-count отсутствует
        const cartItems = await response.json();
        console.log('Обновление счетчика корзины: получено', cartItems.length, 'элементов');
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Инициализация
async function init() {
    await loadCart();
    await updateCartCount();
}

init();

// Обработчик кнопки оформления заказа
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', showCheckoutModal);
}

// Функция для добавления товара в корзину
async function addToCart(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            showNotification('Пожалуйста, войдите в систему', 'warning');
            return;
        }

        const response = await fetch(`${window.baseUrl}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ dishId, quantity: 1 })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showNotification('Товар добавлен в корзину', 'cart');
        // Добавляем задержку перед обновлением
        await new Promise(resolve => setTimeout(resolve, 1000));
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при добавлении в корзину:', error);
        showNotification('Ошибка при добавлении товара', 'error');
    }
}

// Функция для переключения статуса избранного
async function toggleFavorite(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            showNotification('Пожалуйста, войдите в систему', 'warning');
            return;
        }

        const isFavorite = await isDishFavorite(dishId);
        const method = isFavorite ? 'DELETE' : 'POST';
        const url = isFavorite ? `${window.baseUrl}/favorites/${dishId}` : `${window.baseUrl}/favorites`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            ...(method === 'POST' && { body: JSON.stringify({ dishId }) })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await updateFavoritesCount();
        showNotification(
            isFavorite ? 'Товар удален из избранного' : 'Товар добавлен в избранное',
            'favorite'
        );
    } catch (error) {
        console.error('Ошибка при обновлении избранного:', error);
        showNotification('Ошибка при обновлении избранного', 'error');
    }
}

// Функция для получения данных корзины
async function fetchCart() {
    try {
        const token = window.auth.getToken();
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cartItems = await response.json();
        
        // Получаем полную информацию о каждом блюде
        const itemsWithDetails = await Promise.all(
            cartItems.map(async (item) => {
                try {
                    const dishResponse = await fetch(`${window.baseUrl}/dishes/${item.id}`);
                    if (!dishResponse.ok) {
                        return null;
                    }
                    const dish = await dishResponse.json();
                    return {
                        ...dish,
                        quantity: item.quantity
                    };
                } catch (error) {
                    console.error(`Ошибка при получении информации о блюде ${item.id}:`, error);
                    return null;
                }
            })
        );

        return itemsWithDetails.filter(item => item !== null);
    } catch (error) {
        console.error('Ошибка при получении данных корзины:', error);
        return [];
    }
}