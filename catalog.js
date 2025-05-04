const dishes = [{
        id: 1,
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheddar cheese, lettuce, and tomato.",
        price: 12.99,
        category: "Burger",
        image: "images/food1.png",
        rating: 4.5
    },
    {
        id: 2,
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with pancetta, parmesan, and egg yolk.",
        price: 15.50,
        category: "Pasta",
        image: "images/food2.png",
        rating: 4.8
    },
    {
        id: 3,
        name: "California Roll",
        description: "Sushi roll with crab, avocado, and cucumber.",
        price: 10.99,
        category: "Sushi",
        image: "images/food3.png",
        rating: 4.2
    },
    {
        id: 4,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, mozzarella, and basil.",
        price: 13.75,
        category: "Pizza",
        image: "images/food4.png",
        rating: 4.7
    },
    {
        id: 5,
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with croutons and Caesar dressing.",
        price: 8.99,
        category: "Salad",
        image: "images/food1.png",
        rating: 4.0
    },
    {
        id: 6,
        name: "BBQ Bacon Burger",
        description: "Beef patty with BBQ sauce, bacon, and onion rings.",
        price: 14.25,
        category: "Burger",
        image: "images/food2.png",
        rating: 4.6
    },
    {
        id: 7,
        name: "Fusilli Pesto",
        description: "Spiral pasta with fresh basil pesto and pine nuts.",
        price: 14.00,
        category: "Pasta",
        image: "images/food3.png",
        rating: 4.3
    },
    {
        id: 8,
        name: "Spicy Tuna Roll",
        description: "Sushi roll with spicy tuna and seaweed.",
        price: 11.50,
        category: "Sushi",
        image: "images/food4.png",
        rating: 4.4
    },
    {
        id: 9,
        name: "Pepperoni Pizza",
        description: "Pizza with spicy pepperoni and mozzarella.",
        price: 15.00,
        category: "Pizza",
        image: "images/food1.png",
        rating: 4.9
    },
    {
        id: 10,
        name: "Greek Salad",
        description: "Feta cheese, olives, cucumber, and red onion.",
        price: 9.50,
        category: "Salad",
        image: "images/food2.png",
        rating: 4.1
    },
    {
        id: 11,
        name: "Mushroom Swiss Burger",
        description: "Beef patty with sautéed mushrooms and Swiss cheese.",
        price: 13.99,
        category: "Burger",
        image: "images/food3.png",
        rating: 4.5
    },
    {
        id: 12,
        name: "Lasagna Bolognese",
        description: "Layered pasta with meat sauce and béchamel.",
        price: 16.75,
        category: "Pasta",
        image: "images/food4.png",
        rating: 4.8
    },
    {
        id: 13,
        name: "Dragon Roll",
        description: "Sushi roll with eel, avocado, and tobiko.",
        price: 12.25,
        category: "Sushi",
        image: "images/food1.png",
        rating: 4.6
    },
    {
        id: 14,
        name: "Veggie Pizza",
        description: "Pizza with bell peppers, mushrooms, and olives.",
        price: 14.50,
        category: "Pizza",
        image: "images/food2.png",
        rating: 4.3
    },
    {
        id: 15,
        name: "Cobb Salad",
        description: "Grilled chicken, bacon, egg, and avocado.",
        price: 10.75,
        category: "Salad",
        image: "images/food3.png",
        rating: 4.4
    }
];

const catalogContainer = document.getElementById('catalog-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryButtons = document.querySelectorAll('.category-filter');
const arrayMethodButtons = document.querySelectorAll('.array-method');

let currentCategory = 'all';
let currentDishes = [...dishes];


function renderCatalog(dishesToRender) {
    catalogContainer.innerHTML = '';
    if (dishesToRender.length === 0) {
        catalogContainer.innerHTML = '<p class="no-results">No dishes found</p>';
        return;
    }
    dishesToRender.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <div class="info">
                <h3>${dish.name}</h3>
                <p>${dish.description}</p>
                <p class="price">€${dish.price.toFixed(2)}</p>
                <p>Rating: ${dish.rating}</p>
                <p>Category: ${dish.category}</p>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
}

function filterAndSort() {
    let filteredDishes = [...dishes];

    // Search
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredDishes = filteredDishes.filter(dish =>
            dish.name.toLowerCase().includes(searchTerm) ||
            dish.description.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    if (currentCategory !== 'all') {
        filteredDishes = filteredDishes.filter(dish => dish.category === currentCategory);
    }

    // Sort
    const sortBy = sortSelect.value;
    if (sortBy === 'name') {
        filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
        filteredDishes.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
        filteredDishes.sort((a, b) => b.rating - a.rating);
    }

    currentDishes = filteredDishes;
    renderCatalog(filteredDishes);
}

searchInput.addEventListener('input', filterAndSort);
sortSelect.addEventListener('change', filterAndSort);

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.dataset.category;
        filterAndSort();
    });
});

arrayMethodButtons.forEach(button => {
    button.addEventListener('click', () => {
        const method = button.dataset.method;
        let result = [];

        if (method === 'map') {
            result = dishes.map(dish => ({
                ...dish,
                name: dish.name.toUpperCase()
            }));
            renderCatalog(result);
        } else if (method === 'filter') {
            result = dishes.filter(dish => dish.price < 20);
            renderCatalog(result);
        } else if (method === 'reduce') {
            const totalPrice = dishes.reduce((sum, dish) => sum + dish.price, 0);
            alert(`Total price of all dishes: €${totalPrice.toFixed(2)}`);
            renderCatalog(dishes);
        } else if (method === 'sort') {
            result = [...dishes].sort((a, b) => b.price - a.price);
            renderCatalog(result);
        } else if (method === 'slice') {
            result = dishes.slice(0, 5);
            renderCatalog(result);
        } else if (method === 'find') {
            const found = dishes.find(dish => dish.rating === 5);
            renderCatalog(found ? [found] : []);
        } else if (method === 'some') {
            const hasCheap = dishes.some(dish => dish.price < 10);
            alert(`Are there dishes under €10? ${hasCheap}`);
            renderCatalog(dishes);
        } else if (method === 'every') {
            const allHighRated = dishes.every(dish => dish.rating > 3);
            alert(`Are all dishes rated above 3? ${allHighRated}`);
            renderCatalog(dishes);
        } else if (method === 'forEach') {
            let names = '';
            dishes.forEach(dish => names += dish.name + '\n');
            alert(`Dish names:\n${names}`);
            renderCatalog(dishes);
        } else if (method === 'concat') {
            const newDish = {
                id: 16,
                name: "Sample Dish",
                description: "A sample dish.",
                price: 9.99,
                category: "Sample",
                image: "images/food4.png",
                rating: 4.0
            };
            result = dishes.concat(newDish);
            renderCatalog(result);
        }
    });
});

// Initial render
renderCatalog(dishes);