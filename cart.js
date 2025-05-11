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
                    
                    return {
                        id: item.cartItemId,
                        dishId: dishId,
                        quantity: item.quantity,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image
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
            
            return `
                <div class="w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm">
                    <div class="p-4 font-['Martel_Sans'] text-[#3f4255]">
                        <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${item.name}</h3>
                        <p class="text-sm mb-2">${item.description}</p>
                        <p class="text-yellow-500 font-bold mb-2">€${item.price.toFixed(2)}</p>
                        <div class="flex items-center gap-2 mb-2">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-all duration-300">-</button>
                            <span class="font-['Poppins']">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-all duration-300">+</button>
                        </div>
                        <p class="text-sm mb-2">Subtotal: €${itemTotal.toFixed(2)}</p>
                        <div class="flex justify-between items-center gap-2 mt-2">
                            <button onclick="removeFromCart(${item.id})" class="remove-btn bg-red-500 text-white px-2 py-1 rounded w-[120px]">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        totalPriceElement.textContent = `Total: €${totalPrice.toFixed(2)}`;
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
    if (!dishId) {
        console.error('ID товара не определен');
        return;
    }

    if (isUpdating) {
        console.log('Удаление уже выполняется, пропускаем запрос');
        return;
    }

    try {
        isUpdating = true;
        const token = window.auth.getToken();
        if (!token) {
            throw new Error('No token found');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${window.baseUrl}/cart/${dishId}`, {
            method: 'DELETE',
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
        
        await loadCart();
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при удалении из корзины:', error);
        alert('Ошибка при удалении из корзины: ' + error.message);
    } finally {
        isUpdating = false;
    }
}

// Оформление заказа с повторной попыткой для очистки корзины
async function checkout() {
    if (isUpdating) {
        console.log('Оформление заказа уже выполняется, пропускаем запрос');
        return;
    }

    try {
        isUpdating = true;
        const token = window.auth.getToken();
        if (!token) {
            throw new Error('Токен не найден');
        }

        console.log('Проверка токена авторизации...');
        const controllerToken = new AbortController();
        const timeoutToken = setTimeout(() => controllerToken.abort(), 5000);
        const tokenCheck = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controllerToken.signal
        });
        clearTimeout(timeoutToken);

        if (tokenCheck.status === 401) {
            console.error('Токен недействителен или истек');
            alert('Сессия истекла. Пожалуйста, войдите снова.');
            window.location.href = 'login.html';
            return;
        }

        console.log('Отправка запроса на получение корзины...');
        const controllerCart = new AbortController();
        const timeoutCart = setTimeout(() => controllerCart.abort(), 5000);
        const cartResponse = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controllerCart.signal
        });
        clearTimeout(timeoutCart);

        if (!cartResponse.ok) {
            const errorText = await cartResponse.text();
            throw new Error(`Failed to fetch cart: ${cartResponse.status} ${errorText}`);
        }

        const cartItems = await cartResponse.json();
        console.log('Товары в корзине для оформления заказа:', cartItems);
        
        if (cartItems.length === 0) {
            alert('Корзина пуста');
            return;
        }

        console.log('Создание нового заказа...');
        const controllerOrder = new AbortController();
        const timeoutOrder = setTimeout(() => controllerOrder.abort(), 5000);
        const orderResponse = await fetch(`${window.baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cartItems.map(item => ({
                    dishId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: 'completed',
                createdAt: new Date().toISOString()
            }),
            signal: controllerOrder.signal
        });
        clearTimeout(timeoutOrder);

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            throw new Error(`Failed to create order: ${orderResponse.status} ${errorText}`);
        }

        // Повторная попытка очистки корзины
        console.log('Очистка корзины...');
        let clearCartResponse;
        let attempts = 3;
        while (attempts > 0) {
            try {
                const controllerClear = new AbortController();
                const timeoutClear = setTimeout(() => controllerClear.abort(), 5000);
                clearCartResponse = await fetch(`${window.baseUrl}/cart/clear`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: controllerClear.signal
                });
                clearTimeout(timeoutClear);
                break;
            } catch (error) {
                attempts--;
                console.warn(`Ошибка очистки корзины, осталось попыток: ${attempts}`, error);
                if (attempts === 0) {
                    throw new Error(`Failed to clear cart after retries: ${error.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка перед повторной попыткой
            }
        }

        if (!clearCartResponse.ok) {
            const errorText = await clearCartResponse.text();
            throw new Error(`Failed to clear cart: ${clearCartResponse.status} ${errorText}`);
        }

        alert('Заказ успешно оформлен!');
        await loadCart();
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        alert('Ошибка при оформлении заказа: ' + error.message);
    } finally {
        isUpdating = false;
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
checkoutBtn.addEventListener('click', checkout);