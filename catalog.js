const catalogContainer = document.getElementById('catalog-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryButtons = document.querySelectorAll('.category-filter');
const arrayMethodButtons = document.querySelectorAll('.array-method');
const priceMinInput = document.createElement('input');
const priceMaxInput = document.createElement('input');
const ratingMinInput = document.createElement('input');
const ratingMaxInput = document.createElement('input');
const paginationContainer = document.createElement('div');

let currentCategory = 'all';
let currentPage = 1;
const itemsPerPage = 4;
const baseUrl = 'http://localhost:3000';

priceMinInput.type = 'number';
priceMinInput.placeholder = 'Min Price';
priceMinInput.className = 'p-2 border-2 border-yellow-300 rounded-md font-["Martel_Sans"] transition-all duration-300 ease-in-out focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50';
priceMaxInput.type = 'number';
priceMaxInput.placeholder = 'Max Price';
priceMaxInput.className = 'p-2 border-2 border-yellow-300 rounded-md font-["Martel_Sans"] transition-all duration-300 ease-in-out focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50';
ratingMinInput.type = 'number';
ratingMinInput.placeholder = 'Min Rating';
ratingMinInput.className = 'p-2 border-2 border-yellow-300 rounded-md font-["Martel_Sans"] transition-all duration-300 ease-in-out focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50';
ratingMaxInput.type = 'number';
ratingMaxInput.placeholder = 'Max Rating';
ratingMaxInput.className = 'p-2 border-2 border-yellow-300 rounded-md font-["Martel_Sans"] transition-all duration-300 ease-in-out focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50';

const filterContainer = document.querySelector('.flex.flex-wrap.gap-5.mb-5');
filterContainer.appendChild(priceMinInput);
filterContainer.appendChild(priceMaxInput);
filterContainer.appendChild(ratingMinInput);
filterContainer.appendChild(ratingMaxInput);

paginationContainer.className = 'flex justify-center gap-4 mt-8';
catalogContainer.parentElement.appendChild(paginationContainer);

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

async function addToFavorites(dishId) {
    try {
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
    } catch (error) {
        console.error('Error adding to favorites:', error);
    }
}

async function addToCart(dishId) {
    try {
        const response = await fetch(`${baseUrl}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dishId,
                quantity: 1
            })
        });
        if (response.ok) {
            alert('Added to cart!');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

function renderCatalog(dishes) {
    console.log('Rendering catalog with dishes:', dishes);
    catalogContainer.innerHTML = '';
    if (dishes.length === 0) {
        catalogContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">No dishes found</p>';
        return;
    }
    dishes.forEach(dish => {
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
                <div class="flex gap-2 mt-2">
                    <button class="favorite-btn bg-yellow-500 text-white px-2 py-1 rounded" data-id="${dish.id}">Add to Favorites</button>
                    <button class="cart-btn bg-green-500 text-white px-2 py-1 rounded" data-id="${dish.id}">Add to Cart</button>
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
    if (searchTerm) {
        params.q = searchTerm;
    }
    if (currentCategory !== 'all') {
        params.category = currentCategory;
    }
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
    if (e.target.classList.contains('favorite-btn')) {
        const id = parseInt(e.target.dataset.id);
        await addToFavorites(id);
    } else if (e.target.classList.contains('cart-btn')) {
        const id = parseInt(e.target.dataset.id);
        await addToCart(id);
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
}

init();