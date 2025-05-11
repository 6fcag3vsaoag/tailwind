from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from uuid import uuid4
import logging
import jwt
from datetime import datetime, timedelta
from functools import wraps

# Настройка логирования
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Разрешить все источники

# Путь к db.json
DB_FILE = 'db.json'

# Секретный ключ для JWT
JWT_SECRET = 'your-secret-key'  # В продакшене используйте безопасный ключ

# Чтение данных из db.json
def load_db():
    try:
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.debug(f"Загружены данные из БД: {data}")
                return data
        logger.info("Файл БД не найден, создаем новую БД")
        return {"dishes": [], "favorites": [], "cart": [], "users": []}
    except Exception as e:
        logger.error(f"Ошибка при чтении БД: {str(e)}")
        raise

# Сохранение данных в db.json
def save_db(data):
    try:
        logger.debug(f"Сохраняем данные в БД: {data}")
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logger.info("База данных успешно сохранена")
    except Exception as e:
        logger.error(f"Ошибка при сохранении базы данных: {str(e)}")
        raise

# Получение следующего ID для ресурса
def get_next_id(resource):
    db = load_db()
    items = db.get(resource, [])
    next_id = max([item['id'] for item in items], default=0) + 1
    logger.debug(f"Сгенерирован следующий ID для {resource}: {next_id}")
    return next_id

# Функция для фильтрации, сортировки и пагинации
def filter_sort_paginate(items, args):
    # Фильтрация по поисковому запросу (q)
    if 'q' in args:
        query = args['q'].lower()
        items = [item for item in items if query in item['name'].lower() or query in item['description'].lower()]

    # Фильтрация по категории
    if 'category' in args:
        items = [item for item in items if item['category'] == args['category']]

    # Фильтрация по диапазону цены
    if 'price_gte' in args:
        items = [item for item in items if item['price'] >= float(args['price_gte'])]
    if 'price_lte' in args:
        items = [item for item in items if item['price'] <= float(args['price_lte'])]

    # Фильтрация по диапазону рейтинга
    if 'rating_gte' in args:
        items = [item for item in items if item['rating'] >= float(args['rating_gte'])]
    if 'rating_lte' in args:
        items = [item for item in items if item['rating'] <= float(args['rating_lte'])]

    # Сортировка
    if '_sort' in args:
        sort_key = args['_sort']
        reverse = args.get('_order', 'asc') == 'desc'
        items = sorted(items, key=lambda x: x.get(sort_key, 0), reverse=reverse)

    # Пагинация
    page = int(args.get('_page', 1))
    limit = int(args.get('_limit', 10))
    start = (page - 1) * limit
    end = start + limit
    total = len(items)
    items = items[start:end]

    return items, total

# Middleware для проверки JWT токена
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Получаем токен из заголовка
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Неверный формат токена'}), 401
        
        if not token:
            return jsonify({'error': 'Токен отсутствует'}), 401
        
        try:
            # Декодируем токен
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = None
            
            # Получаем пользователя из базы данных
            db = load_db()
            current_user = next((user for user in db['users'] if user['id'] == data['user_id']), None)
            
            if not current_user:
                return jsonify({'error': 'Пользователь не найден'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Токен истек'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Неверный токен'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

# Эндпоинты для users
@app.route('/users', methods=['GET'])
def get_users():
    logger.info("Получен GET запрос на /users")
    db = load_db()
    username = request.args.get('username')
    if username:
        logger.debug(f"Поиск пользователя по username: {username}")
        users = [user for user in db['users'] if user['username'] == username]
        return jsonify(users)
    return jsonify(db['users'])

@app.route('/users', methods=['POST'])
def add_user():
    try:
        logger.info("Получен POST запрос на /users")
        logger.debug(f"Заголовки запроса: {dict(request.headers)}")
        logger.debug(f"Данные запроса: {request.get_data()}")
        
        if not request.is_json:
            logger.error("Получен не JSON запрос")
            return jsonify({"error": "Требуется JSON"}), 400
            
        new_user = request.json
        logger.debug(f"Данные пользователя: {new_user}")
        
        db = load_db()
        
        # Проверка уникальности email и username
        if any(user['email'] == new_user['email'] for user in db['users']):
            logger.warning(f"Email {new_user['email']} уже зарегистрирован")
            return jsonify({"error": "Email уже зарегистрирован"}), 400
        if any(user['username'] == new_user['username'] for user in db['users']):
            logger.warning(f"Никнейм {new_user['username']} уже занят")
            return jsonify({"error": "Никнейм уже занят"}), 400
        
        new_user['id'] = get_next_id('users')
        logger.info(f"Создан новый ID пользователя: {new_user['id']}")
        
        db['users'].append(new_user)
        logger.info(f"Пользователь добавлен в список: {new_user['username']}")
        
        save_db(db)
        logger.info("База данных обновлена")
        
        return jsonify(new_user), 201
    except Exception as e:
        logger.error(f"Ошибка при добавлении пользователя: {str(e)}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    db = load_db()
    user = next((item for item in db['users'] if item['id'] == id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/users/<int:id>', methods=['PUT'])
@token_required
def update_user(current_user, id):
    if current_user['id'] != id and current_user['role'] != 'admin':
        return jsonify({"error": "Нет прав для обновления этого профиля"}), 403
        
    db = load_db()
    user = next((item for item in db['users'] if item['id'] == id), None)
    
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404
        
    # Проверяем уникальность email и username
    data = request.json
    if 'email' in data and data['email'] != user['email']:
        if any(u['email'] == data['email'] for u in db['users'] if u['id'] != id):
            return jsonify({"error": "Email уже используется"}), 400
            
    if 'username' in data and data['username'] != user['username']:
        if any(u['username'] == data['username'] for u in db['users'] if u['id'] != id):
            return jsonify({"error": "Никнейм уже занят"}), 400
    
    # Обновляем данные пользователя
    user.update(data)
    save_db(db)
    
    # Удаляем пароль из ответа
    user_data = {k: v for k, v in user.items() if k != 'password'}
    return jsonify(user_data)

@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    db = load_db()
    db['users'] = [item for item in db['users'] if item['id'] != id]
    save_db(db)
    return jsonify({"message": "User deleted"}), 200

# Эндпоинты для dishes
@app.route('/dishes', methods=['GET'])
def get_dishes():
    db = load_db()
    items, total = filter_sort_paginate(db['dishes'], request.args)
    response = jsonify(items)
    response.headers['X-Total-Count'] = str(total)
    return response

@app.route('/dishes/<int:id>', methods=['GET'])
def get_dish(id):
    db = load_db()
    dish = next((item for item in db['dishes'] if item['id'] == id), None)
    if dish:
        return jsonify(dish)
    return jsonify({"error": "Dish not found"}), 404

@app.route('/dishes', methods=['POST'])
def add_dish():
    db = load_db()
    new_dish = request.json
    new_dish['id'] = get_next_id('dishes')
    db['dishes'].append(new_dish)
    save_db(db)
    return jsonify(new_dish), 201

# Эндпоинты для favorites
@app.route('/favorites', methods=['GET'])
def get_favorites():
    db = load_db()
    return jsonify(db['favorites'])

@app.route('/favorites', methods=['POST'])
def add_favorite():
    db = load_db()
    new_favorite = request.json
    new_favorite['id'] = get_next_id('favorites')
    db['favorites'].append(new_favorite)
    save_db(db)
    return jsonify(new_favorite), 201

@app.route('/favorites/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    db = load_db()
    db['favorites'] = [item for item in db['favorites'] if item['id'] != id]
    save_db(db)
    return jsonify({"message": "Favorite deleted"}), 200

@app.route('/favorites', methods=['GET'])
def get_favorites_by_dish_id():
    db = load_db()
    dish_id = request.args.get('dishId')
    if dish_id:
        favorites = [item for item in db['favorites'] if str(item['dishId']) == dish_id]
        return jsonify(favorites)
    return jsonify(db['favorites'])

# Эндпоинты для cart
@app.route('/cart', methods=['GET'])
def get_cart():
    db = load_db()
    return jsonify(db['cart'])

@app.route('/cart', methods=['POST'])
def add_cart_item():
    db = load_db()
    new_item = request.json
    new_item['id'] = get_next_id('cart')
    db['cart'].append(new_item)
    save_db(db)
    return jsonify(new_item), 201

@app.route('/cart/<int:id>', methods=['PATCH'])
def update_cart_item(id):
    db = load_db()
    for item in db['cart']:
        if item['id'] == id:
            item.update(request.json)
            save_db(db)
            return jsonify(item)
    return jsonify({"error": "Cart item not found"}), 404

@app.route('/cart/<int:id>', methods=['DELETE'])
def delete_cart_item(id):
    db = load_db()
    db['cart'] = [item for item in db['cart'] if item['id'] != id]
    save_db(db)
    return jsonify({"message": "Cart item deleted"}), 200

@app.route('/cart/clear', methods=['DELETE'])
def clear_cart():
    db = load_db()
    db['cart'] = []
    save_db(db)
    return jsonify({"message": "Cart cleared"}), 200

@app.route('/cart', methods=['GET'])
def get_cart_by_dish_id():
    db = load_db()
    dish_id = request.args.get('dishId')
    if dish_id:
        cart_items = [item for item in db['cart'] if str(item['dishId']) == dish_id]
        return jsonify(cart_items)
    return jsonify(db['cart'])

# Эндпоинт для аутентификации
@app.route('/auth/login', methods=['POST'])
def login():
    logger.info("Получен POST запрос на /auth/login")
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Необходимо указать email и пароль'}), 400
            
        db = load_db()
        user = next((user for user in db['users'] if user['email'] == data['email']), None)
        
        if not user or user['password'] != data['password']:
            return jsonify({'error': 'Неверный email или пароль'}), 401
            
        # Создаем JWT токен
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.utcnow() + timedelta(days=1)
        }, JWT_SECRET, algorithm='HS256')
        
        # Удаляем пароль из данных пользователя
        user_data = {k: v for k, v in user.items() if k != 'password'}
        
        return jsonify({
            'token': token,
            'user': user_data
        })
        
    except Exception as e:
        logger.error(f"Ошибка при аутентификации: {str(e)}")
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)