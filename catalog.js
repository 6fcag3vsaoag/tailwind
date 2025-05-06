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
const baseUrl = 'http://localhost:3000';

async function fetchDishes(params = {}) {
    try {
        const query = new URLSearchParams({
            _page: currentPage,
            _limit: itemsPerPage,
            ...params
        }).toString();
        console.log('Fetching dishes with URL:', `${baseUrl}/dishes?${query}`);
        const response = await fetch(`${baseUrl}/dishes?${query}`);
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
        const response = await fetch(`${baseUrl}/favorites`);
        if (!response.ok) throw new Error('Failed to fetch favorites');
        return await response.json();
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

async function fetchCart() {
    try {
        const response = await fetch(`${baseUrl}/cart`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
}

async function updateCartCount() {
    const cartItems = await fetchCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

async function toggleFavorite(dishId) {
    const favorites = await fetchFavorites();
    const isFavorite = favorites.some(fav => fav.dishId === dishId);

    try {
        if (isFavorite) {
            const favorite = favorites.find(fav => fav.dishId === dishId);
            const response = await fetch(`${baseUrl}/favorites/${favorite.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Removed from favorites!');
            }
        } else {
            const response = await fetch(`${baseUrl}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dishId
                })
            });
            if (response.ok) {
                alert('Added to favorites!');
            }
        }
        filterAndSort(); // Refresh catalog to update heart icon
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
}

async function addToCart(dishId, quantity) {
    try {
        const response = await fetch(`${baseUrl}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dishId,
                quantity: parseInt(quantity)
            })
        });
        if (response.ok) {
            alert(`Added ${quantity} item(s) to cart!`);
            await updateCartCount(); // Update cart count after adding
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

async function isDishFavorite(dishId) {
    const favorites = await fetchFavorites();
    return favorites.some(fav => fav.dishId === dishId);
}

function renderCatalog(dishes) {
    console.log('Rendering catalog with dishes:', dishes);
    catalogContainer.innerHTML = '';
    if (dishes.length === 0) {
        catalogContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">No dishes found</p>';
        return;
    }
    dishes.forEach(async dish => {
        const isFavorite = await isDishFavorite(dish.id);
        const card = document.createElement('div');
        card.className = 'w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm">
            <div class="p-4 font-['Martel_Sans'] text-[#3f4255]">
                <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
                <p class="text-sm mb-2">${dish.description}</p>
                <p class="text-yellow-500 font-bold mb-2">€${dish.price.toFixed(2)}</p>
                <p class="text-sm mb-2">Rating: ${dish.rating}</p>
                <p class="text-sm">Category: ${dish.category}</p>
                <div class="flex justify-between items-center gap-2 mt-2">
                    <button class="favorite-btn flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded w-[120px]" data-id="${dish.id}">
                        <svg class="w-4 h-4 ${isFavorite ? 'fill-red-500' : 'fill-white'}" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        ${isFavorite ? 'Unfavorite' : 'Favorite'}
                    </button>
                    <div class="flex items-center gap-1">
                        <input type="number" min="1" value="1" class="quantity-input w-12 p-1 border-2 border-yellow-300 rounded-md text-center">
                        <button class="cart-btn bg-green-500 text-white px-2 py-1 rounded" data-id="${dish.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
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
        await fetch(`${baseUrl}/dishes`, {
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

catalogContainer.addEventListener('click', async (e) => {
    if (e.target.closest('.favorite-btn')) {
        const btn = e.target.closest('.favorite-btn');
        const id = parseInt(btn.dataset.id);
        await toggleFavorite(id);
    } else if (e.target.closest('.cart-btn')) {
        const btn = e.target.closest('.cart-btn');
        const id = parseInt(btn.dataset.id);
        const quantityInput = btn.parentElement.querySelector('.quantity-input');
        const quantity = quantityInput.value;
        if (quantity > 0) {
            await addToCart(id, quantity);
        } else {
            alert('Please enter a valid quantity');
        }
    }
});

async function init() {
    const categories = new Set((await fetchDishes()).data.map(dish => dish.category));
    console.log('Available categories:', categories);
    categoryButtons.forEach(button => {
        if (button.dataset.category !== 'all' && !categories.has(button.dataset.category)) {
            button.remove();
        }
    });
    filterAndSort();
    await updateCartCount(); // Initialize cart count on page load
}

init();