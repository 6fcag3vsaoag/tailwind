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
        console.log('Toggling favorite for dish:', dishId);
        const token = window.auth.getToken();
        if (!token) {
            console.error('Токен не найден');
            showToast('Пожалуйста, войдите в систему', 'error');
            window.location.href = 'login.html';
            return;
        }

        // Проверяем, есть ли уже в избранном
        const isFavorite = await checkIfFavorite(dishId);
        console.log('Current favorite status:', isFavorite);

        if (isFavorite) {
            // Если уже в избранном - удаляем
            console.log('Removing from favorites');
            const response = await fetch(`${window.baseUrl}/favorites/${dishId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove from favorites');
            }
            console.log('Successfully removed from favorites');
            // showToast('Блюдо удалено из избранного');
        } else {
            // Если нет в избранном - добавляем
            console.log('Adding to favorites');
            const response = await fetch(`${window.baseUrl}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ dishId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                throw new Error(errorData.message || 'Failed to add to favorites');
            }
            console.log('Successfully added to favorites');
            showToast('Блюдо добавлено в избранное');
        }

        // Обновляем каталог
        await filterAndSort();
        // Обновляем состояние кнопок избранного
        await updateFavoriteButtons();
        // Обновляем счетчики
        await updateCounters();
    } catch (error) {
        console.error('Error toggling favorite:', error);
        // showToast(error.message, 'error');
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
            window.location.href = 'login.html';
            return;
        }

        const quantityInput = document.querySelector(`#quantity-${dishId}`);
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

        const response = await fetch(`${window.baseUrl}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ dishId, quantity })
        });

        if (!response.ok) throw new Error('Failed to add to cart');
        
        // showToast('Товар добавлен в корзину');
        // Обновляем счетчики
        await updateCounters();
    } catch (error) {
        console.error('Error adding to cart:', error);
        // showToast('Произошла ошибка при добавлении в корзину', 'error');
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="relative">
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-64 object-cover rounded-lg">
            <div class="absolute top-2 right-2">
                <button onclick="toggleFavorite(${dish.id})" class="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100">
                    <svg class="w-6 h-6 ${isFavorite ? 'text-red-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-900">${dish.name}</h2>
            <p class="text-gray-600">${dish.description}</p>
            <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-yellow-500">${dish.price} ₽</span>
                <span class="text-sm text-gray-500">/ ${dish.portion}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-yellow-500">★</span>
                <span class="text-gray-600">${dish.rating}</span>
            </div>
            <div class="flex items-center space-x-4">
                <button onclick="addToCart(${dish.id})" class="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                    Добавить в корзину
                </button>
            </div>
        </div>
    </div>`;
}

// Функция для создания модального окна редактирования товара
function createEditProductModal(dish) {
    return `
    <form id="editProductForm" class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700">Название</label>
            <input type="text" name="name" value="${dish.name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Описание</label>
            <textarea name="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">${dish.description}</textarea>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Цена</label>
            <input type="number" name="price" value="${dish.price}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Порция</label>
            <input type="text" name="portion" value="${dish.portion}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Рейтинг</label>
            <input type="number" name="rating" value="${dish.rating}" step="0.1" min="0" max="5" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">URL изображения</label>
            <input type="text" name="image" value="${dish.image}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
        </div>
        <div class="flex justify-end space-x-3">
            <button type="button" onclick="hideModal()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Отмена
            </button>
            <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
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
    if (!catalogContainer) return;

    const catalogHTML = await Promise.all(dishes.map(async dish => {
        const isFavorite = await isDishFavorite(dish.id);
        console.log(`Dish ${dish.id} favorite status:`, isFavorite);
        return createProductCard(dish, isFavorite);
    }));

    catalogContainer.innerHTML = catalogHTML.join('');
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
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    try {
        const response = await fetch(`${window.baseUrl}/dishes/${dishId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.auth.getToken()}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete dish');
        
        showNotification('Товар успешно удален', 'success');
        await filterAndSort();
    } catch (error) {
        console.error('Error deleting dish:', error);
        showNotification('Ошибка при удалении товара', 'error');
    }
}

function renderPagination(totalItems) {
    console.log('Rendering pagination with total items:', totalItems);
    paginationContainer.innerHTML = '';
    if (itemsPerPage === Infinity) {
        // Не отображаем пагинацию, если выбрано "All"
        return;
    }
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `px-4 py-2 border-2 border-yellow-300 rounded-md font-['Martel_Sans'] font-bold text-gray-500 ${i === currentPage ? 'bg-yellow-300' : 'bg-gray-100'} hover:bg-yellow-300 hover:text-gray-800 transition-all duration-300 ease-in-out`;
        button.addEventListener('click', () => {
            currentPage = i;
            filterAndSort();
        });
        paginationContainer.appendChild(button);
    }
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

searchInput.addEventListener('input', () => {
    currentPage = 1;
    filterAndSort();
});
sortSelect.addEventListener('change', () => {
    currentPage = 1;
    filterAndSort();
});
itemsPerPageSelect.addEventListener('change', () => {
    itemsPerPage = itemsPerPageSelect.value === 'all' ? Infinity : parseInt(itemsPerPageSelect.value);
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
    button.addEventListener('click', () => applyArrayMethod(button.dataset.method));
});
priceMinInput.addEventListener('input', () => {
    currentPage = 1;
    filterAndSort();
});
priceMaxInput.addEventListener('input', () => {
    currentPage = 1;
    filterAndSort();
});
ratingMinInput.addEventListener('input', () => {
    currentPage = 1;
    filterAndSort();
});
ratingMaxInput.addEventListener('input', () => {
    currentPage = 1;
    filterAndSort();
});

document.addEventListener('click', async (e) => {
    if (!window.auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    if (e.target.closest('.favorite-btn')) {
        const btn = e.target.closest('.favorite-btn');
        const id = parseInt(btn.dataset.dishId);
        console.log('Favorite button clicked for dish:', id);
        await toggleFavorite(id);
    } else if (e.target.closest('.cart-btn')) {
        const btn = e.target.closest('.cart-btn');
        const id = parseInt(btn.dataset.dishId);
        const quantityInput = btn.parentElement.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value);
        console.log('Cart button clicked for dish:', id, 'quantity:', quantity);
        if (quantity > 0) {
            await addToCart(id);
            await updateCartCount();
        } else {
            alert('Please enter a valid quantity');
        }
    }
});

async function init() {
    console.log('Initializing catalog...');
    try {
        const { data, totalItems } = await fetchDishes();
        console.log('Initial dishes data:', data);
        
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid data format received from server');
        }
        
        const categories = new Set(data.map(dish => dish.category));
        console.log('Available categories:', categories);
        
        // Обновляем кнопки категорий
        if (categoryButtons) {
            categoryButtons.forEach(button => {
                if (button.dataset.category !== 'all' && !categories.has(button.dataset.category)) {
                    button.remove();
                }
            });
        }
        
        // Рендерим каталог
        if (catalogContainer) {
            renderCatalog(data);
        }
        
        // Рендерим пагинацию
        if (paginationContainer) {
            renderPagination(totalItems);
        }
        
        // Обновляем счетчик корзины
        await updateCartCount();
        
        console.log('Catalog initialization completed');
    } catch (error) {
        console.error('Error during catalog initialization:', error);
        if (catalogContainer) {
            catalogContainer.innerHTML = '<p class="text-center text-red-500">Ошибка при загрузке каталога. Пожалуйста, попробуйте позже.</p>';
        }
    }
}

init();