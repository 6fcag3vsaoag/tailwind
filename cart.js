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
                    
                    // Используем id вместо dishId
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

        const response = await fetch(`${window.baseUrl}/cart/${dishId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadCart();
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при обновлении количества:', error);
        alert('Ошибка при обновлении количества');
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

        const response = await fetch(`${window.baseUrl}/cart/${dishId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadCart();
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при удалении из корзины:', error);
        alert('Ошибка при удалении из корзины');
    } finally {
        isUpdating = false;
    }
}

// Оформление заказа
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

        // Получаем текущие товары из корзины
        const cartResponse = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!cartResponse.ok) {
            throw new Error(`HTTP error! status: ${cartResponse.status}`);
        }

        const cartItems = await cartResponse.json();
        console.log('Товары в корзине для оформления заказа:', cartItems);
        
        if (cartItems.length === 0) {
            alert('Корзина пуста');
            return;
        }

        // Создаем новый заказ
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
            })
        });

        if (!orderResponse.ok) {
            throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }

        // Очищаем корзину после успешного создания заказа
        const clearCartResponse = await fetch(`${window.baseUrl}/cart/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!clearCartResponse.ok) {
            throw new Error('Failed to clear cart');
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

async function fetchCartItems() {
    try {
        const response = await fetch(`${baseUrl}/cart`);
        if (!response.ok) throw new Error('Failed to fetch cart items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}

async function fetchDish(dishId) {
    try {
        const response = await fetch(`${baseUrl}/dishes/${dishId}`);
        if (!response.ok) throw new Error(`Failed to fetch dish ${dishId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching dish ${dishId}:`, error);
        return null;
    }
}

async function removeCartItem(cartItemId) {
    try {
        const response = await fetch(`${baseUrl}/cart/${cartItemId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Item removed from cart!');
            await renderCart(); // Re-render after removal
            updateCartCount(); // Update header cart count
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

async function clearCart() {
    try {
        const response = await fetch(`${baseUrl}/cart/clear`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Cart cleared!');
            await renderCart(); // Re-render after clearing
            updateCartCount(); // Update header cart count
        } else {
            throw new Error('Failed to clear cart');
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}

async function renderCart() {
    const cartItems = await fetchCartItems();

    // Clear previous header buttons
    const existingClearButton = cartHeader.querySelector('.clear-cart-btn');
    if (existingClearButton) existingClearButton.remove();

    // Add Clear Cart button to header if there are items
    if (cartItems.length > 0) {
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Cart';
        clearButton.className = 'clear-cart-btn px-3 py-1 border-2 border-red-500 rounded-md bg-red-500 font-["Martel_Sans"] font-semibold text-sm text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 ease-in-out';
        clearButton.addEventListener('click', clearCart);
        cartHeader.appendChild(clearButton);
    }

    cartContainer.innerHTML = '';
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">Your cart is empty</p>';
        totalPriceElement.textContent = '';
        return;
    }

    // Fetch dish details for each cart item
    const dishPromises = cartItems.map(item => fetchDish(item.dishId));
    const dishes = (await Promise.all(dishPromises)).filter(dish => dish !== null);

    // Calculate total price
    let totalPrice = 0;
    const cartWithDishes = cartItems
        .map(item => {
            const dish = dishes.find(d => d.id === item.dishId);
            if (dish) {
                totalPrice += dish.price * item.quantity;
                return {
                    ...item,
                    dish
                };
            }
            return null;
        })
        .filter(item => item !== null);

    // Update total price
    totalPriceElement.textContent = `Total: €${totalPrice.toFixed(2)}`;

    // Render each cart item as a card
    cartWithDishes.forEach(item => {
        const {
            dish
        } = item;
        const card = document.createElement('div');
        card.className = 'w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm">
            <div class="p-4 font-['Martel_Sans'] text-[#3f4255]">
                <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
                <p class="text-sm mb-2">${dish.description}</p>
                <p class="text-yellow-500 font-bold mb-2">€${dish.price.toFixed(2)}</p>
                <p class="text-sm mb-2">Quantity: ${item.quantity}</p>
                <p class="text-sm mb-2">Subtotal: €${(dish.price * item.quantity).toFixed(2)}</p>
                <p class="text-sm">Category: ${dish.category}</p>
                <div class="flex justify-between items-center gap-2 mt-2">
                    <button class="remove-btn bg-red-500 text-white px-2 py-1 rounded w-[120px]" data-cart-id="${item.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;
        cartContainer.appendChild(card);
    });
}

// Event listener for removing individual cart items
cartContainer.addEventListener('click', async (e) => {
    if (e.target.closest('.remove-btn')) {
        const btn = e.target.closest('.remove-btn');
        const cartItemId = parseInt(btn.dataset.cartId);
        await removeCartItem(cartItemId);
    }
});

async function createOrder(cartItems, totalPrice) {
    try {
        const response = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cartItems.map(item => ({
                    dishId: item.dishId,
                    quantity: item.quantity,
                    price: item.dish.price
                })),
                totalAmount: totalPrice,
                status: 'completed',
                createdAt: new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Failed to create order');
        
        // Очищаем корзину после успешного создания заказа
        await clearCart();
        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// Обновляем обработчик кнопки оформления заказа
checkoutBtn.addEventListener('click', checkout);

// Обновление количества товаров в корзине
async function updateCartCount() {
    try {
        const token = window.auth.getToken();
        if (!token) {
            return;
        }

        const response = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cartItems = await response.json();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
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