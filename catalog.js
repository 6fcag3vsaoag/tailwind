const catalogContainer = document.getElementById('catalog-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const itemsPerPageSelect = document.getElementById('items-per-page');
const categoryButtons = document.querySelectorAll('.category-filter');
const arrayMethodButtons = document.querySelectorAll('.array-method');
const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');
const ratingMinInput = document.getElementById('rating-min');
const ratingMaxInput = document.getElementById('rating-max');
const paginationContainer = document.getElementById('pagination-container');
const cartCountElement = document.getElementById('cart-count');

let currentCategory = 'all';
let currentPage = 1;
let itemsPerPage = 4;

async function fetchDishes(params = {}) {
    try {
        const queryParams = new URLSearchParams({
            _page: currentPage,
            ...params
        });
        // Добавляем _limit только если itemsPerPage не Infinity
        if (itemsPerPage !== Infinity) {
            queryParams.set('_limit', itemsPerPage);
        }
        console.log('Fetching dishes with URL:', `${window.baseUrl}/dishes?${queryParams}`);
        const response = await fetch(`${window.baseUrl}/dishes?${queryParams}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const totalItems = parseInt(response.headers.get('X-Total-Count') || 0);
        const data = await response.json();
        console.log('Fetched dishes:', data, 'Total items:', totalItems);

        return {
            data,
            totalItems
        };
    } catch (error) {
        console.error('Error fetching dishes:', error);
        return {
            data: [],
            totalItems: 0
        };
    }
}

async function fetchFavorites() {
    try {
        const response = await fetch(`${window.baseUrl}/favorites`, {
            headers: {
                'Authorization': `Bearer ${window.auth.getToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch favorites');
        return await response.json();
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

async function fetchCart() {
    try {
        const token = window.auth.getToken();
        if (!token) {
            console.log('No token found, skipping cart fetch');
            return [];
        }

        const response = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            console.log('Unauthorized, skipping cart fetch');
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
}

async function updateCartCount() {
    try {
        const cartItems = await fetchCart();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Функция для показа уведомлений
// function showToast(message, type = 'success') {
//     const toast = document.createElement('div');
//     toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-['Poppins'] transition-all duration-300 z-50 ${
//         type === 'success' ? 'bg-green-500' : 'bg-red-500'
//     }`;
//     toast.textContent = message;
//     document.body.appendChild(toast);

//     // Анимация появления
//     setTimeout(() => {
//         toast.style.transform = 'translateX(0)';
//     }, 100);

//     // Автоматическое скрытие через 3 секунды
//     setTimeout(() => {
//         toast.style.transform = 'translateX(100%)';
//         setTimeout(() => {
//             toast.remove();
//         }, 300);
//     }, 3000);
// }

async function toggleFavorite(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            showNotification('Пожалуйста, войдите в систему', 'warning');
            return;
        }

        const isFavorite = await checkIfFavorite(dishId);
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

        showNotification(
            isFavorite ? 'Товар удален из избранного' : 'Товар добавлен в избранное',
            'favorite'
        );
        // Добавляем задержку перед обновлением
        await new Promise(resolve => setTimeout(resolve, 1000));
        await filterAndSort();
        await updateFavoriteButtons();
        await updateFavoritesCount();
    } catch (error) {
        console.error('Ошибка при обновлении избранного:', error);
        showNotification('Ошибка при обновлении избранного', 'error');
    }
}

async function checkIfFavorite(dishId) {
    try {
        console.log('Checking if dish is favorite:', dishId);
        const token = window.auth.getToken();
        if (!token) {
            console.log('No token found');
            return false;
        }

        const response = await fetch(`${window.baseUrl}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log('Failed to fetch favorites');
            return false;
        }

        const favorites = await response.json();
        console.log('Fetched favorites structure:', JSON.stringify(favorites, null, 2));
        
        // Проверяем, есть ли блюдо в избранном по id блюда
        const isFavorite = favorites.some(fav => fav.id === dishId);
        console.log('Is favorite:', isFavorite);
        return isFavorite;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
}

async function updateFavoriteButtons() {
    try {
        console.log('Updating favorite buttons');
        const token = window.auth.getToken();
        if (!token) {
            console.log('No token found');
            return;
        }

        const response = await fetch(`${window.baseUrl}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }

        const favorites = await response.json();
        console.log('Fetched favorites:', favorites);

        // Обновляем состояние каждой кнопки
        const buttons = document.querySelectorAll('.favorite-btn');
        console.log('Found favorite buttons:', buttons.length);

        buttons.forEach(button => {
            const dishId = parseInt(button.dataset.dishId);
            console.log('Processing button for dish:', dishId);

            // Проверяем, есть ли блюдо в избранном
            const isFavorite = favorites.some(fav => fav.id === dishId); // Изменено: fav.id вместо fav.dishId
            console.log(`Button for dish ${dishId}, isFavorite: ${isFavorite}`);

            const text = button.querySelector('span');
            const icon = button.querySelector('svg');

            if (isFavorite) {
                console.log(`Setting button ${dishId} to favorite state`);
                button.classList.add('active');
                button.classList.remove('bg-yellow-500');
                button.classList.add('bg-red-500');
                if (text) text.textContent = 'Unfavorite';
            } else {
                console.log(`Setting button ${dishId} to non-favorite state`);
                button.classList.remove('active');
                button.classList.remove('bg-red-500');
                button.classList.add('bg-yellow-500');
                if (text) text.textContent = 'Favorite';
            }
        });
    } catch (error) {
        console.error('Error updating favorite buttons:', error);
    }
}

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
        showNotification('Ошибка при добавлении в корзину', 'error');
    }
}

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

// Функция для создания модального окна с детальной информацией о товаре
async function createProductDetailModal(dish) {
    const isFavorite = await isDishFavorite(dish.id);
    return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div class="relative">
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-64 object-cover rounded-lg dark:brightness-90">
            <div class="absolute top-2 right-2">
                <button onclick="toggleFavorite(${dish.id})" class="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <svg class="w-6 h-6 ${isFavorite ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">${dish.name}</h2>
            <p class="text-gray-600 dark:text-gray-300">${dish.description}</p>
            <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-yellow-500 dark:text-yellow-400">${dish.price} ₽</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">/ ${dish.portion}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-yellow-500 dark:text-yellow-400">★</span>
                <span class="text-gray-600 dark:text-gray-300">${dish.rating}</span>
            </div>
            <div class="flex items-center space-x-4">
                <button onclick="addToCart(${dish.id})" class="flex-1 bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors">
                    Добавить в корзину
                </button>
            </div>
        </div>
    </div>`;
}

// Функция для создания модального окна редактирования товара
function createEditProductModal(dish) {
    return `
    <form id="editProductForm" class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Название</label>
            <input type="text" name="name" value="${dish.name}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-yellow-400 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Описание</label>
            <textarea name="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 dark:border-yellow-400 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100">${dish.description}</textarea>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Цена</label>
            <input type="number" name="price" value="${dish.price}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-yellow-400 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Порция</label>
            <input type="text" name="portion" value="${dish.portion}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-yellow-400 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Рейтинг</label>
            <input type="number" name="rating" value="${dish.rating}" step="0.1" min="0" max="5" class="mt-1 block w-full rounded-md border-gray-300 dark:border-yellow-400 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">URL изображения</label>
            <input type="text" name="image" value="${dish.image}" class="mt-1 block w-full rounded-md border-gray-300 dark:border-yellow-400 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100">
        </div>
        <div class="flex justify-end space-x-3">
            <button type="button" onclick="hideModal()" class="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Отмена
            </button>
            <button type="submit" class="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors">
                Сохранить
            </button>
        </div>
    </form>`;
}

// Функция для создания модального окна добавления товара
function createAddProductModal() {
    return `
    <form id="addProductForm" class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700">Название</label>
            <input type="text" name="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Описание</label>
            <textarea name="description" rows="3" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"></textarea>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Цена</label>
            <input type="number" name="price" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Порция</label>
            <input type="text" name="portion" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Рейтинг</label>
            <input type="number" name="rating" required step="0.1" min="0" max="5" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">URL изображения</label>
            <input type="text" name="image" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div class="flex justify-end space-x-3">
            <button type="button" onclick="hideModal()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Отмена
            </button>
            <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                Добавить
            </button>
        </div>
    </form>`;
}

// Обновляем функцию renderCatalog для добавления обработчиков кликов
async function renderCatalog(dishes) {
    if (!dishes || dishes.length === 0) {
        catalogContainer.innerHTML = `<div class="col-span-full text-center text-gray-500" data-i18n="no-items">Товары не найдены</div>`;
        return;
    }

    const cartItems = await fetchCart();
    const favorites = await fetchFavorites();

    catalogContainer.innerHTML = dishes.map(dish => {
        const isInCart = cartItems.some(item => item.dishId === dish.id);
        const isFavorite = favorites.some(fav => fav.id === dish.id);
        
        return `
            <div class="w-[296px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-yellow-300 dark:border-yellow-400 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50 dark:hover:shadow-yellow-400/30 cursor-pointer" onclick="showProductDetail(${dish.id})">
                <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm dark:brightness-90">
                <div class="p-4 font-['Martel_Sans'] text-[#3f4255] dark:text-gray-200">
                    <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
                    <p class="text-sm mb-2">${dish.description}</p>
                    <p class="text-yellow-500 dark:text-yellow-400 font-bold mb-2">${dish.price} ${i18Obj[getCurrentLang()]['currency']}</p>
                    <div class="flex justify-between items-center gap-2 mt-2">
                        <button onclick="event.stopPropagation(); toggleFavorite(${dish.id})" 
                            class="favorite-btn flex items-center gap-1 ${isFavorite ? 'bg-red-500 dark:bg-red-600' : 'bg-yellow-500 dark:bg-yellow-600'} text-white px-2 py-1 rounded w-[120px]" data-dish-id="${dish.id}">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span data-i18n="${isFavorite ? 'remove-from-favorites' : 'add-to-favorites'}">
                                ${isFavorite ? i18Obj[getCurrentLang()]['remove-from-favorites'] : i18Obj[getCurrentLang()]['add-to-favorites']}
                            </span>
                        </button>
                        <button onclick="event.stopPropagation(); addToCart(${dish.id})" 
                            class="cart-btn bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded w-[120px] hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300" data-dish-id="${dish.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span data-i18n="${isInCart ? 'remove-from-cart' : 'add-to-cart'}">
                                ${isInCart ? i18Obj[getCurrentLang()]['remove-from-cart'] : i18Obj[getCurrentLang()]['add-to-cart']}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Функция для отображения детальной информации о товаре
async function showProductDetail(dishId) {
    try {
        const response = await fetch(`${window.baseUrl}/dishes/${dishId}`);
        if (!response.ok) throw new Error('Failed to fetch dish details');
        const dish = await response.json();
        
        const modalContent = await createProductDetailModal(dish);
        showModal(modalContent, dish.name);
    } catch (error) {
        console.error('Error showing product detail:', error);
        showNotification('Ошибка при загрузке информации о товаре', 'error');
    }
}

// Функция для отображения формы редактирования товара
async function showEditProduct(dishId) {
    try {
        const response = await fetch(`${window.baseUrl}/dishes/${dishId}`);
        if (!response.ok) throw new Error('Failed to fetch dish details');
        const dish = await response.json();
        
        const modalContent = createEditProductModal(dish);
        showModal(modalContent, 'Редактирование товара');
        
        // Добавляем обработчик отправки формы
        document.getElementById('editProductForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedDish = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch(`${window.baseUrl}/dishes/${dishId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.auth.getToken()}`
                    },
                    body: JSON.stringify(updatedDish)
                });
                
                if (!response.ok) throw new Error('Failed to update dish');
                
                hideModal();
                showNotification('Товар успешно обновлен', 'success');
                await filterAndSort();
            } catch (error) {
                console.error('Error updating dish:', error);
                showNotification('Ошибка при обновлении товара', 'error');
            }
        });
    } catch (error) {
        console.error('Error showing edit form:', error);
        showNotification('Ошибка при загрузке формы редактирования', 'error');
    }
}

// Функция для отображения формы добавления товара
function showAddProduct() {
    const modalContent = createAddProductModal();
    showModal(modalContent, 'Добавление товара');
    
    // Добавляем обработчик отправки формы
    document.getElementById('addProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newDish = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(`${window.baseUrl}/dishes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.auth.getToken()}`
                },
                body: JSON.stringify(newDish)
            });
            
            if (!response.ok) throw new Error('Failed to add dish');
            
            hideModal();
            showNotification('Товар успешно добавлен', 'success');
            await filterAndSort();
        } catch (error) {
            console.error('Error adding dish:', error);
            showNotification('Ошибка при добавлении товара', 'error');
        }
    });
}

// Функция для удаления товара
async function deleteProduct(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            showNotification('Пожалуйста, войдите в систему', 'warning');
            return;
        }

        const response = await fetch(`${window.baseUrl}/dishes/${dishId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showNotification('Товар успешно удален', 'success');
        // Добавляем задержку перед обновлением
        await new Promise(resolve => setTimeout(resolve, 1000));
        await filterAndSort();
    } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        showNotification('Ошибка при удалении товара', 'error');
    }
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Кнопка "Первая"
    paginationHTML += `
        <button class="px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}"
            ${currentPage === 1 ? 'disabled' : `onclick="goToPage(1)"`}>
            <span data-i18n="first">${i18Obj[getCurrentLang()]['first']}</span>
        </button>
    `;

    // Кнопка "Предыдущая"
    paginationHTML += `
        <button class="px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}"
            ${currentPage === 1 ? 'disabled' : `onclick="goToPage(${currentPage - 1})"`}>
            <span data-i18n="prev">${i18Obj[getCurrentLang()]['prev']}</span>
        </button>
    `;

    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || // Первая страница
            i === totalPages || // Последняя страница
            (i >= currentPage - 1 && i <= currentPage + 1) // Страницы вокруг текущей
        ) {
            paginationHTML += `
                <button class="px-3 py-1 rounded ${currentPage === i ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}"
                    onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (
            i === currentPage - 2 || // Перед пропуском
            i === currentPage + 2 // После пропуска
        ) {
            paginationHTML += `
                <span class="px-2">...</span>
            `;
        }
    }

    // Кнопка "Следующая"
    paginationHTML += `
        <button class="px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}"
            ${currentPage === totalPages ? 'disabled' : `onclick="goToPage(${currentPage + 1})"`}>
            <span data-i18n="next">${i18Obj[getCurrentLang()]['next']}</span>
        </button>
    `;

    // Кнопка "Последняя"
    paginationHTML += `
        <button class="px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}"
            ${currentPage === totalPages ? 'disabled' : `onclick="goToPage(${totalPages})"`}>
            <span data-i18n="last">${i18Obj[getCurrentLang()]['last']}</span>
        </button>
    `;

    // Информация о текущей странице
    paginationHTML += `
        <div class="ml-4 text-gray-600">
            <span data-i18n="page">${i18Obj[getCurrentLang()]['page']}</span> ${currentPage} 
            <span data-i18n="of">${i18Obj[getCurrentLang()]['of']}</span> ${totalPages}
        </div>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

async function filterAndSort() {
    const params = {};
    const searchTerm = searchInput.value.trim();
    if (searchTerm) params.q = searchTerm;
    if (currentCategory !== 'all') params.category = currentCategory;
    const sortBy = sortSelect.value;
    if (sortBy) {
        params._sort = sortBy;
        params._order = sortBy === 'name' ? 'asc' : 'desc';
    }
    const priceMin = parseFloat(priceMinInput.value);
    const priceMax = parseFloat(priceMaxInput.value);
    const ratingMin = parseFloat(ratingMinInput.value);
    const ratingMax = parseFloat(ratingMaxInput.value);
    if (!isNaN(priceMin)) params['price_gte'] = priceMin;
    if (!isNaN(priceMax)) params['price_lte'] = priceMax;
    if (!isNaN(ratingMin)) params['rating_gte'] = ratingMin;
    if (!isNaN(ratingMax)) params['rating_lte'] = ratingMax;

    console.log('Filter and sort params:', params);
    const {
        data,
        totalItems
    } = await fetchDishes(params);
    renderCatalog(data);
    renderPagination(totalItems);
}

async function applyArrayMethod(method) {
    let result = [];
    const dishes = (await fetchDishes()).data;

    if (method === 'map') {
        result = dishes.map(dish => ({
            ...dish,
            name: dish.name.toUpperCase()
        }));
    } else if (method === 'filter') {
        result = dishes.filter(dish => dish.price < 20);
    } else if (method === 'reduce') {
        const totalPrice = dishes.reduce((sum, dish) => sum + dish.price, 0);
        alert(`Total price of all dishes: €${totalPrice.toFixed(2)}`);
        return;
    } else if (method === 'sort') {
        result = [...dishes].sort((a, b) => b.price - a.price);
    } else if (method === 'slice') {
        result = dishes.slice(0, 5);
    } else if (method === 'find') {
        const found = dishes.find(dish => dish.rating === 5);
        result = found ? [found] : [];
    } else if (method === 'some') {
        const hasCheap = dishes.some(dish => dish.price < 10);
        alert(`Are there dishes under €10? ${hasCheap}`);
        return;
    } else if (method === 'every') {
        const allHighRated = dishes.every(dish => dish.rating > 3);
        alert(`Are all dishes rated above 3? ${allHighRated}`);
        return;
    } else if (method === 'forEach') {
        let names = '';
        dishes.forEach(dish => names += dish.name + '\n');
        alert(`Dish names:\n${names}`);
        return;
    } else if (method === 'concat') {
        const newDish = {
            id: 16,
            name: "Concat Dish",
            description: "Concat Added",
            price: 9.99,
            category: "Sample",
            image: "images/food4.png",
            rating: 5.0
        };
        await fetch(`${window.baseUrl}/dishes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDish)
        });
        result = [...dishes, newDish];
    }
    renderCatalog(result);
}

async function goToPage(page) {
    currentPage = page;
    await filterAndSort();
}

async function init() {
    try {
        // Инициализация переводов
        getTranslate(getCurrentLang());
        
        // Добавляем обработчики событий для элементов с атрибутами data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = i18Obj[getCurrentLang()][key];
        });

        // Загрузка данных
        await filterAndSort();
        await updateCartCount();
        await updateFavoriteButtons();
        await updateFavoritesCount();

        // Добавляем обработчики событий
        searchInput.addEventListener('input', debounce(filterAndSort, 300));
        sortSelect.addEventListener('change', filterAndSort);
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = e.target.value === 'all' ? Infinity : parseInt(e.target.value);
            currentPage = 1;
            filterAndSort();
        });

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentCategory = button.dataset.category;
                currentPage = 1;
                filterAndSort();
            });
        });

        arrayMethodButtons.forEach(button => {
            button.addEventListener('click', () => {
                const method = button.dataset.method;
                applyArrayMethod(method);
            });
        });

        // Добавляем обработчики для фильтров цены и рейтинга
        [priceMinInput, priceMaxInput, ratingMinInput, ratingMaxInput].forEach(input => {
            input.addEventListener('input', debounce(filterAndSort, 300));
        });

    } catch (error) {
        console.error('Error initializing catalog:', error);
        showNotification(i18Obj[getCurrentLang()]['error'], 'error');
    }
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', init);