const favoritesContainer = document.getElementById('favorites-container');
const favoritesHeader = document.getElementById('favorites-header');

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!window.auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    loadFavorites();
});

// Загрузка избранных блюд
async function loadFavorites() {
    try {
        const token = window.auth.getToken();
        if (!token) {
            console.error('Токен не найден');
            return;
        }

        const response = await fetch(`${window.baseUrl}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const favorites = await response.json();
        console.log('Получены избранные блюда:', favorites);
        
        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p class="text-center text-gray-500">У вас пока нет избранных блюд</p>';
            return;
        }
        
        favoritesContainer.innerHTML = favorites.map(dish => createProductCard(dish, true)).join('');
    } catch (error) {
        console.error('Ошибка при загрузке избранного:', error);
        favoritesContainer.innerHTML = '<p class="text-center text-red-500">Ошибка при загрузке избранного</p>';
    }
}

// Удаление из избранного
async function removeFromFavorites(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            console.error('Токен не найден');
            return;
        }

        const response = await fetch(`${window.baseUrl}/favorites/${dishId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadFavorites();
        // Обновляем счетчики
        await updateCounters();
        showNotification('Товар удален из избранного', 'success');
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        showNotification('Ошибка при удалении из избранного', 'error');
    }
}

// Добавление в корзину
async function addToCart(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            console.error('Токен не найден');
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
        
        showNotification('Товар добавлен в корзину', 'success');
        await updateCartCount();
    } catch (error) {
        console.error('Ошибка при добавлении в корзину:', error);
        showNotification('Ошибка при добавлении в корзину', 'error');
    }
}

async function fetchDish(dishId) {
    try {
        const response = await fetch(`${window.baseUrl}/dishes/${dishId}`);
        if (!response.ok) throw new Error(`Failed to fetch dish ${dishId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching dish ${dishId}:`, error);
        return null;
    }
}

async function removeFavorite(favoriteId) {
    try {
        const response = await fetch(`${window.baseUrl}/favorites/${favoriteId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Removed from favorites!');
            renderFavorites(); // Re-render after removal
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}

async function clearFavorites() {
    try {
        const favorites = await fetchFavorites();
        const deletePromises = favorites.map(fav =>
            fetch(`${window.baseUrl}/favorites/${fav.id}`, {
                method: 'DELETE'
            })
        );
        await Promise.all(deletePromises);
        alert('All favorites cleared!');
        renderFavorites(); // Re-render after clearing
    } catch (error) {
        console.error('Error clearing favorites:', error);
    }
}

async function renderFavorites() {
    const favorites = await fetchFavorites();

    // Clear previous header buttons
    const existingClearButton = favoritesHeader.querySelector('.clear-favorites-btn');
    if (existingClearButton) existingClearButton.remove();

    // Add Clear Favorites button to header if there are favorites
    if (favorites.length > 0) {
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Favorites';
        clearButton.className = 'clear-favorites-btn px-3 py-1 border-2 border-red-500 rounded-md bg-red-500 font-["Martel_Sans"] font-semibold text-sm text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 ease-in-out';
        clearButton.addEventListener('click', showClearFavoritesModal);
        favoritesHeader.appendChild(clearButton);
    }

    favoritesContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">No favorite dishes found</p>';
        return;
    }

    // Fetch dish details for each favorite
    const dishPromises = favorites.map(fav => fetchDish(fav.dishId));
    const dishes = (await Promise.all(dishPromises)).filter(dish => dish !== null);

    // Render each favorite dish as a card
    dishes.forEach(dish => {
        const favorite = favorites.find(fav => fav.dishId === dish.id);
        const card = document.createElement('div');
        card.className = 'w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm">
            <div class="p-4 font-['Martel_Sans'] text-[#3f4255]">
                <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
                <p class="text-sm mb-2">${dish.description}</p>
                <p class="text-yellow-500 font-bold mb-2">€${dish.price.toFixed(2)}</p>
                <div class="flex justify-between items-center gap-2 mt-2">
                    <button class="favorite-btn flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded w-[120px]" data-favorite-id="${favorite.id}">
                        <svg class="w-4 h-4 fill-red-500" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Unfavorite
                    </button>
                    <button onclick="addToCart(${dish.id})" class="bg-green-500 text-white px-2 py-1 rounded w-[120px] hover:bg-green-600 transition-all duration-300">
                        В корзину
                    </button>
                </div>
            </div>
        `;
        favoritesContainer.appendChild(card);
    });
}

// Event listener for removing individual favorites
favoritesContainer.addEventListener('click', async (e) => {
    if (e.target.closest('.favorite-btn')) {
        const btn = e.target.closest('.favorite-btn');
        const favoriteId = parseInt(btn.dataset.favoriteId);
        await removeFavorite(favoriteId);
    }
});

async function init() {
    await renderFavorites();
}

init();

// Функция для создания модального окна подтверждения удаления из избранного
function createRemoveFromFavoritesModal(dishName) {
    return `
    <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
        <p class="text-gray-600 mb-6">Вы уверены, что хотите удалить "${dishName}" из избранного?</p>
        <div class="flex justify-center space-x-4">
            <button onclick="hideModal()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Отмена
            </button>
            <button onclick="confirmRemoveFromFavorites()" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Удалить
            </button>
        </div>
    </div>`;
}

// Функция для создания модального окна подтверждения очистки избранного
function createClearFavoritesModal() {
    return `
    <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Подтверждение очистки</h3>
        <p class="text-gray-600 mb-6">Вы уверены, что хотите удалить все товары из избранного?</p>
        <div class="flex justify-center space-x-4">
            <button onclick="hideModal()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Отмена
            </button>
            <button onclick="confirmClearFavorites()" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Удалить все
            </button>
        </div>
    </div>`;
}

// Глобальные переменные для хранения данных между модальными окнами
let currentRemoveDishId = null;
let currentRemoveDishName = null;

// Функция для отображения модального окна подтверждения удаления из избранного
function showRemoveFromFavoritesModal(dishId, dishName) {
    currentRemoveDishId = dishId;
    currentRemoveDishName = dishName;
    const modalContent = createRemoveFromFavoritesModal(dishName);
    showModal(modalContent, 'Удаление из избранного');
}

// Функция для подтверждения удаления из избранного
async function confirmRemoveFromFavorites() {
    if (!currentRemoveDishId) return;
    
    try {
        await removeFromFavorites(currentRemoveDishId);
        hideModal();
        showNotification('Товар успешно удален из избранного', 'success');
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        showNotification('Ошибка при удалении из избранного', 'error');
    } finally {
        currentRemoveDishId = null;
        currentRemoveDishName = null;
    }
}

// Функция для отображения модального окна подтверждения очистки избранного
function showClearFavoritesModal() {
    const modalContent = createClearFavoritesModal();
    showModal(modalContent, 'Очистка избранного');
}

// Функция для подтверждения очистки избранного
async function confirmClearFavorites() {
    try {
        const favorites = await fetchFavorites();
        const deletePromises = favorites.map(fav =>
            fetch(`${window.baseUrl}/favorites/${fav.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${window.auth.getToken()}`
                }
            })
        );
        await Promise.all(deletePromises);
        
        hideModal();
        showNotification('Все товары удалены из избранного', 'success');
        await loadFavorites();
        await updateCounters();
    } catch (error) {
        console.error('Ошибка при очистке избранного:', error);
        showNotification('Ошибка при очистке избранного', 'error');
    }
}

// Функция для переключения избранного
async function toggleFavorite(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            console.error('Токен не найден');
            window.location.href = 'login.html';
            return;
        }

        // Проверяем, есть ли уже в избранном
        const isFavorite = await isDishFavorite(dishId);
        console.log('Current favorite status:', isFavorite);

        if (isFavorite) {
            // Если уже в избранном - удаляем
            await removeFromFavorites(dishId);
        } else {
            // Если нет в избранном - добавляем
            const response = await fetch(`${window.baseUrl}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ dishId })
            });

            if (!response.ok) {
                throw new Error('Failed to add to favorites');
            }
            showNotification('Товар добавлен в избранное', 'success');
        }

        // Обновляем страницу
        await loadFavorites();
        // Обновляем счетчики
        await updateCounters();
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showNotification('Ошибка при обновлении избранного', 'error');
    }
}

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