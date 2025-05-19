const favoritesContainer = document.getElementById('favorites-container');
const favoritesHeader = document.getElementById('favorites-header');

// Функция для получения списка избранных блюд
async function fetchFavorites() {
    try {
        const token = window.auth.getToken();
        if (!token) {
            console.log('Токен не найден');
            return [];
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
        console.log('Получены избранные блюда (полная структура):', JSON.stringify(favorites, null, 2));
        return favorites;
    } catch (error) {
        console.error('Ошибка при получении избранных блюд:', error);
        return [];
    }
}

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!window.auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    renderFavorites();
});

// Удаление из избранного
async function removeFromFavorites(dishId) {
    try {
        const token = window.auth.getToken();
        if (!token) {
            showNotification('Пожалуйста, войдите в систему', 'warning');
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
        
        showNotification('Товар удален из избранного', 'favorite');
        // Добавляем задержку перед обновлением
        await new Promise(resolve => setTimeout(resolve, 1000));
        await renderFavorites();
        await updateFavoritesCount();
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
        const token = window.auth.getToken();
        if (!token) {
            showNotification('Пожалуйста, войдите в систему', 'warning');
            return;
        }

        const response = await fetch(`${window.baseUrl}/favorites/${favoriteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            showNotification('Товар удален из избранного', 'favorite');
            await renderFavorites();
            await updateFavoritesCount();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
        showNotification('Ошибка при удалении из избранного', 'error');
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
    try {
        const favorites = await fetchFavorites();
        console.log('Fetched favorites (структура):', JSON.stringify(favorites, null, 2));

        favoritesContainer.innerHTML = '';
        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">No favorite dishes found</p>';
            return;
        }

        // Fetch dish details for each favorite
        const dishPromises = favorites.map(async (fav) => {
            try {
                console.log('Processing favorite item:', JSON.stringify(fav, null, 2));
                const dishId = fav.dishId || fav.id;
                console.log('Using dishId:', dishId);
                
                if (!dishId) {
                    console.error('No dishId found in favorite item:', fav);
                    return null;
                }

                const dish = await fetchDish(dishId);
                if (!dish) {
                    console.error(`Failed to fetch dish with ID ${dishId}`);
                    return null;
                }
                return { ...dish, favoriteId: fav.id };
            } catch (error) {
                console.error(`Error fetching dish ${fav.dishId || fav.id}:`, error);
                return null;
            }
        });

        const dishes = (await Promise.all(dishPromises)).filter(dish => dish !== null);
        console.log('Fetched dishes:', dishes);

        // Render each favorite dish as a card
        dishes.forEach(dish => {
            const card = document.createElement('div');
            card.className = 'w-[296px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-yellow-300 dark:border-yellow-400 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50 dark:hover:shadow-yellow-400/30 cursor-pointer';
            card.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm dark:brightness-90">
                <div class="p-4 font-['Martel_Sans'] text-[#3f4255] dark:text-gray-200">
                    <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
                    <p class="text-sm mb-2">${dish.description}</p>
                    <p class="text-yellow-500 dark:text-yellow-400 font-bold mb-2">€${dish.price.toFixed(2)}</p>
                    <div class="flex justify-between items-center gap-2 mt-2">
                        <button class="favorite-btn flex items-center gap-1 bg-red-500 dark:bg-red-600 text-white px-2 py-1 rounded w-[120px]" data-favorite-id="${dish.favoriteId}" data-dish-id="${dish.id}">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            Unfavorite
                        </button>
                        <button onclick="addToCart(${dish.id})" class="bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded w-[120px] hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300">
                            В корзину
                        </button>
                    </div>
                </div>
            `;
            favoritesContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error rendering favorites:', error);
        favoritesContainer.innerHTML = '<p class="text-center text-red-500">Ошибка при загрузке избранного</p>';
    }
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

// Функция для переключения избранного
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

        showNotification(
            isFavorite ? 'Товар удален из избранного' : 'Товар добавлен в избранное',
            'favorite'
        );
        // Добавляем задержку перед обновлением
        await new Promise(resolve => setTimeout(resolve, 1000));
        await renderFavorites();
        await updateFavoritesCount();
    } catch (error) {
        console.error('Ошибка при обновлении избранного:', error);
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