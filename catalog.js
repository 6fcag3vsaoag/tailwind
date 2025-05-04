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

/* Получение DOM-элементов для работы с каталогом */
const catalogContainer = document.getElementById('catalog-container'); // Контейнер для карточек блюд
const searchInput = document.getElementById('search-input'); // Поле ввода для поиска
const sortSelect = document.getElementById('sort-select'); // Выпадающий список для сортировки
const categoryButtons = document.querySelectorAll('.category-filter'); // Кнопки фильтрации по категориям
const arrayMethodButtons = document.querySelectorAll('.array-method'); // Кнопки для методов массивов

/* Переменные для хранения текущей категории и списка блюд */
let currentCategory = 'all'; // Текущая выбранная категория (по умолчанию все)
let currentDishes = [...dishes]; // Копия массива блюд для фильтрации и сортировки

/* Функция для отображения карточек блюд в каталоге */
function renderCatalog(dishesToRender) {
    catalogContainer.innerHTML = ''; // Очистка контейнера перед отрисовкой
    /* Проверка, есть ли блюда для отображения */
    if (dishesToRender.length === 0) {
        catalogContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">No dishes found</p>'; // Сообщение, если блюд нет
        return;
    }
    /* Создание карточки для каждого блюда */
    dishesToRender.forEach(dish => {
        const card = document.createElement('div'); // Создание элемента карточки
        card.className = 'w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50'; // Стили карточки с Tailwind
        card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm"> <!-- Изображение блюда -->
        <div class="p-4 font-['Martel_Sans'] text-[#3f4255]"> <!-- Контейнер информации -->
            <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3> <!-- Название блюда -->
            <p class="text-sm mb-2">${dish.description}</p> <!-- Описание блюда -->
            <p class="text-yellow-500 font-bold mb-2">€${dish.price.toFixed(2)}</p> <!-- Цена блюда -->
            <p class="text-sm mb-2">Rating: ${dish.rating}</p> <!-- Рейтинг блюда -->
            <p class="text-sm">Category: ${dish.category}</p> <!-- Категория блюда -->
        </div>
    `;
        catalogContainer.appendChild(card); // Добавление карточки в контейнер
    });
}

/* Функция для фильтрации и сортировки блюд */
function filterAndSort() {
    let filteredDishes = [...dishes]; // Копия исходного массива блюд

    // Поиск по названию или описанию
    const searchTerm = searchInput.value.toLowerCase(); // Получение поискового запроса
    if (searchTerm) {
        filteredDishes = filteredDishes.filter(dish =>
            dish.name.toLowerCase().includes(searchTerm) ||
            dish.description.toLowerCase().includes(searchTerm)
        ); // Фильтрация по поисковому запросу
    }

    // Фильтрация по категории
    if (currentCategory !== 'all') {
        filteredDishes = filteredDishes.filter(dish => dish.category === currentCategory); // Оставляем только блюда выбранной категории
    }

    // Сортировка
    const sortBy = sortSelect.value; // Получение выбранного типа сортировки
    if (sortBy === 'name') {
        filteredDishes.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка по названию (A-Z)
    } else if (sortBy === 'price') {
        filteredDishes.sort((a, b) => a.price - b.price); // Сортировка по цене (по возрастанию)
    } else if (sortBy === 'rating') {
        filteredDishes.sort((a, b) => b.rating - a.rating); // Сортировка по рейтингу (по убыванию)
    }

    currentDishes = filteredDishes; // Сохранение отфильтрованного списка
    renderCatalog(filteredDishes); // Отрисовка отфильтрованных блюд
}

/* Обработчик событий для поля поиска */
searchInput.addEventListener('input', filterAndSort); // Вызов фильтрации при вводе текста

/* Обработчик событий для выпадающего списка сортировки */
sortSelect.addEventListener('change', filterAndSort); // Вызов сортировки при выборе варианта

/* Обработчик событий для кнопок категорий */
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active')); // Снятие активного состояния со всех кнопок
        button.classList.add('active'); // Установка активного состояния для нажатой кнопки
        currentCategory = button.dataset.category; // Сохранение выбранной категории
        filterAndSort(); // Вызов фильтрации и сортировки
    });
});

/* Обработчик событий для кнопок 10 методов для массивов */
arrayMethodButtons.forEach(button => {
    button.addEventListener('click', () => {
        const method = button.dataset.method; // Получение метода из data-method
        let result = []; // Массив для результатов обработки

        /* map в верхний регистр */
        if (method === 'map') {
            result = dishes.map(dish => ({
                ...dish,
                name: dish.name.toUpperCase()
            }));
            renderCatalog(result); // Отрисовка результата
            /* фильтрация дешевле 20 евро */
        } else if (method === 'filter') {
            result = dishes.filter(dish => dish.price < 20);
            renderCatalog(result);
            /* reduc: подсчет общей стоимости */
        } else if (method === 'reduce') {
            const totalPrice = dishes.reduce((sum, dish) => sum + dish.price, 0);
            alert(`Total price of all dishes: €${totalPrice.toFixed(2)}`);
            renderCatalog(dishes); // Отрисовка исходного списка
            /* сортировка блюд по цене убывание*/
        } else if (method === 'sort') {
            result = [...dishes].sort((a, b) => b.price - b.price);
            renderCatalog(result);
            /* slice: выбор первых 5 блюд */
        } else if (method === 'slice') {
            result = dishes.slice(0, 5);
            renderCatalog(result);
            /* find: поиск рейтингом 5 */
        } else if (method === 'find') {
            const found = dishes.find(dish => dish.rating === 5);
            renderCatalog(found ? [found] : []); // Отрисовка найденного блюда или пустого списка
            /* some: есть ли блюда дешевле 10 евро??? */
        } else if (method === 'some') {
            const hasCheap = dishes.some(dish => dish.price < 10);
            alert(`Are there dishes under €10? ${hasCheap}`); // Вывод результата проверки
            renderCatalog(dishes);
            /* every: проверка, имеют ли все блюда рейтинг выше 3??? */
        } else if (method === 'every') {
            const allHighRated = dishes.every(dish => dish.rating > 3);
            alert(`Are all dishes rated above 3? ${allHighRated}`); // Вывод результата проверки
            renderCatalog(dishes);
            /* forEach: сбор и вывод названий всех блюд алертом */
        } else if (method === 'forEach') {
            let names = '';
            dishes.forEach(dish => names += dish.name + '\n');
            alert(`Dish names:\n${names}`); // Вывод списка названий
            renderCatalog(dishes);
            /* Обработка метода concat: добавление нового блюда к списку */
        } else if (method === 'concat') {
            const newDish = {
                id: 16,
                name: "Concat Dish",
                description: "Conctat Added",
                price: 9.99,
                category: "Sample",
                image: "images/food4.png",
                rating: 5.0
            };
            result = dishes.concat(newDish); // Добавление нового блюда
            renderCatalog(result); // Отрисовка обновленного списка
        }
    });
});


renderCatalog(dishes);