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
            _limit: itemsPerPage,
            ...params
        });
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
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-['Poppins'] transition-all duration-300 transform translate-x-full ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Анимация появления
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        toast.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

async function toggleFavorite(dishId) {
    try {
        console.log('Toggling favorite for dish:', dishId);
        const token = window.auth.getToken();
        if (!token) {
            console.error('Токен не найден');
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
            showToast('Блюдо удалено из избранного');
        } else {
            // Если нет в избранном - добавляем
            console.log('Adding to favorites');
            const user = window.auth.getUser();
            if (!user) {
                throw new Error('User not found');
            }

            // Получаем данные блюда
            const dishResponse = await fetch(`${window.baseUrl}/dishes/${dishId}`);
            if (!dishResponse.ok) {
                throw new Error('Failed to fetch dish data');
            }
            const dishData = await dishResponse.json();

            const response = await fetch(`${window.baseUrl}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dishData)
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
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast(error.message, 'error');
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
        console.log('Fetched favorites structure:', JSON.stringify(favorites, null, 2));

        // Обновляем состояние каждой кнопки
        const buttons = document.querySelectorAll('.favorite-btn');
        console.log('Found favorite buttons:', buttons.length);

        buttons.forEach(button => {
            const dishId = parseInt(button.dataset.dishId);
            console.log('Processing button for dish:', dishId);
            
            const isFavorite = favorites.some(fav => fav.dishId === dishId);
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
        
        showToast('Товар добавлен в корзину');
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Произошла ошибка при добавлении в корзину', 'error');
    }
}

async function isDishFavorite(dishId) {
    const favorites = await fetchFavorites();
    return favorites.some(fav => fav.dishId === dishId);
}

async function renderCatalog(dishes) {
    console.log('Rendering catalog with dishes:', dishes);
    catalogContainer.innerHTML = '';
    if (dishes.length === 0) {
        catalogContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">No dishes found</p>';
        return;
    }
    
    const isAuth = window.auth.isAuthenticated();
    console.log('User authenticated:', isAuth);
    
    for (const dish of dishes) {
        const isFavorite = isAuth ? await checkIfFavorite(dish.id) : false;
        const card = document.createElement('div');
        card.className = 'w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm">
            <div class="p-4 font-['Martel_Sans'] text-[#3f4255]">
                <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
                <p class="text-sm mb-2">${dish.description}</p>
                <p class="text-yellow-500 font-bold mb-2">€${dish.price.toFixed(2)}</p>
                <div class="flex justify-between items-center gap-2 mt-2">
                    ${isAuth ? `
                        <button onclick="toggleFavorite(${dish.id})" class="favorite-btn flex items-center gap-1 ${isFavorite ? 'bg-red-500' : 'bg-yellow-500'} text-white px-2 py-1 rounded w-[120px]" data-dish-id="${dish.id}">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span>${isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                        </button>
                    ` : ''}
                    ${isAuth ? `
                        <button onclick="addToCart(${dish.id})" class="cart-btn bg-green-500 text-white px-2 py-1 rounded w-[120px]">
                            В корзину
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        catalogContainer.appendChild(card);
    }
}

function renderPagination(totalItems) {
    console.log('Rendering pagination with total items:', totalItems);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = '';
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