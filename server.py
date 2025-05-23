from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from uuid import uuid4
import logging
import jwt
from datetime import datetime, timedelta
from functools import wraps
from werkzeug.utils import secure_filename

# Настройка логирования
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Настройка CORS с явным указанием методов и заголовков
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}}, supports_credentials=True)

# Путь к db.json (абсолютный путь)
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db.json')
logger.info(f"Путь к файлу БД: {DB_FILE}")

# Папка для сохранения загруженных изображений
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images', 'new')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Допустимые расширения файлов
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Секретный ключ для JWT
JWT_SECRET = 'your-secret-key'  # В продакшене используйте безопасный ключ

# Проверка расширения файла
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Чтение данных из db.json
def load_db():
    try:
        logger.debug(f"Попытка загрузить БД из файла: {DB_FILE}")
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.debug(f"Загружены данные из БД: {data}")
                return data
        logger.warning(f"Файл БД не найден по пути: {DB_FILE}")
        logger.info("Создаем новую БД")
        return {"dishes": [], "favorites": [], "cart": [], "users": [], "feedback": [], "orders": []}
    except Exception as e:
        logger.error(f"Ошибка при чтении БД: {str(e)}")
        logger.error(f"Текущая директория: {os.getcwd()}")
        logger.error(f"Содержимое директории: {os.listdir('.')}")
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
        logger.error(f"Текущая директория: {os.getcwd()}")
        logger.error(f"Содержимое директории: {os.listdir('.')}")
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
    limit = int(args.get('_limit', len(items)))  # Изменено: по умолчанию возвращаем все элементы
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
                logger.error("Неверный формат токена в заголовке Authorization")
                return jsonify({'error': 'Неверный формат токена'}), 401
        
        if not token:
            logger.error("Токен отсутствует в запросе")
            return jsonify({'error': 'Токен отсутствует'}), 401
        
        try:
            # Декодируем токен
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = None
            
            # Получаем пользователя из базы данных
            db = load_db()
            current_user = next((user for user in db['users'] if user['id'] == data['user_id']), None)
            
            if not current_user:
                logger.error(f"Пользователь с ID {data['user_id']} не найден")
                return jsonify({'error': 'Пользователь не найден'}), 401
                
        except jwt.ExpiredSignatureError:
            logger.error("Токен истек")
            return jsonify({'error': 'Токен истек'}), 401
        except jwt.InvalidTokenError:
            logger.error("Неверный токен")
            return jsonify({'error': 'Неверный токен'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

# Эндпоинт для раздачи статических файлов (изображений)
@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images'), filename)

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
@token_required
def add_dish(current_user):
    try:
        if current_user['role'] != 'admin':
            logger.error(f"Пользователь {current_user['id']} не имеет прав администратора")
            return jsonify({"error": "Требуются права администратора"}), 403

        # Проверяем наличие файла
        if 'image' not in request.files:
            logger.error("Изображение не предоставлено в запросе")
            return jsonify({"error": "Изображение не предоставлено"}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            logger.error("Файл не выбран")
            return jsonify({"error": "Файл не выбран"}), 400
            
        if file and allowed_file(file.filename):
            # Безопасное имя файла
            filename = secure_filename(file.filename)
            # Генерируем уникальное имя файла
            unique_filename = f"{uuid4()}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            logger.info(f"Файл сохранен: {file_path}")
            
            # Путь для клиента (относительный)
            client_image_path = f"images/new/{unique_filename}"
            
            # Получаем остальные данные
            name = request.form.get('name')
            description = request.form.get('description')
            price = request.form.get('price')
            category = request.form.get('category')
            
            if not all([name, description, price, category]):
                logger.error("Не все обязательные поля заполнены")
                return jsonify({"error": "Все поля должны быть заполнены"}), 400
                
            try:
                price = float(price)
            except ValueError:
                logger.error("Цена не является числом")
                return jsonify({"error": "Цена должна быть числом"}), 400
                
            db = load_db()
            new_dish = {
                'id': get_next_id('dishes'),
                'name': name,
                'description': description,
                'price': price,
                'category': category,
                'image': client_image_path,
                'rating': 0.0  # Начальный рейтинг
            }
            
            db['dishes'].append(new_dish)
            save_db(db)
            logger.info(f"Новое блюдо добавлено: {new_dish['id']}")
            return jsonify(new_dish), 201
        else:
            logger.error(f"Недопустимый формат файла: {file.filename}")
            return jsonify({"error": "Недопустимый формат файла. Разрешены: png, jpg, jpeg, gif"}), 400
    except Exception as e:
        logger.error(f"Ошибка при добавлении блюда: {str(e)}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

@app.route('/dishes/<int:id>', methods=['PUT'])
@token_required
def update_dish(current_user, id):
    try:
        if current_user['role'] != 'admin':
            logger.error(f"Пользователь {current_user['id']} не имеет прав администратора")
            return jsonify({"error": "Требуются права администратора"}), 403

        db = load_db()
        dish = next((item for item in db['dishes'] if item['id'] == id), None)
        
        if not dish:
            logger.error(f"Блюдо с ID {id} не найдено")
            return jsonify({"error": "Блюдо не найдено"}), 404
            
        # Получаем данные из формы
        name = request.form.get('name', dish['name'])
        description = request.form.get('description', dish['description'])
        price = request.form.get('price', dish['price'])
        category = request.form.get('category', dish['category'])
        
        try:
            price = float(price)
        except ValueError:
            logger.error("Цена не является числом")
            return jsonify({"error": "Цена должна быть числом"}), 400
            
        # Обработка изображения
        image_path = dish['image']
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                # Удаляем старое изображение, если оно существует
                old_image_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), dish['image'])
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
                    logger.info(f"Старое изображение удалено: {old_image_path}")
                    
                # Сохраняем новое изображение
                filename = secure_filename(file.filename)
                unique_filename = f"{uuid4()}_{filename}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)
                logger.info(f"Новое изображение сохранено: {file_path}")
                image_path = f"images/new/{unique_filename}"
        
        # Обновляем данные блюда
        dish.update({
            'name': name,
            'description': description,
            'price': price,
            'category': category,
            'image': image_path
        })
        
        save_db(db)
        logger.info(f"Блюдо обновлено: {id}")
        return jsonify(dish)
    except Exception as e:
        logger.error(f"Ошибка при обновлении блюда: {str(e)}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

@app.route('/dishes/<int:id>', methods=['DELETE'])
@token_required
def delete_dish(current_user, id):
    try:
        if current_user['role'] != 'admin':
            logger.error(f"Пользователь {current_user['id']} не имеет прав администратора")
            return jsonify({"error": "Требуются права администратора"}), 403

        db = load_db()
        dish = next((item for item in db['dishes'] if item['id'] == id), None)
        
        if not dish:
            logger.error(f"Блюдо с ID {id} не найдено")
            return jsonify({"error": "Блюдо не найдено"}), 404
            
        # Удаляем изображение, если оно существует
        image_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), dish['image'])
        if os.path.exists(image_path):
            os.remove(image_path)
            logger.info(f"Изображение удалено: {image_path}")
            
        db['dishes'] = [item for item in db['dishes'] if item['id'] != id]
        save_db(db)
        logger.info(f"Блюдо удалено: {id}")
        return jsonify({"message": "Dish deleted"}), 200
    except Exception as e:
        logger.error(f"Ошибка при удалении блюда: {str(e)}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

# Эндпоинты для избранного
@app.route('/favorites', methods=['GET'])
@token_required
def get_favorites(current_user):
    try:
        logger.info(f"Получение избранного для пользователя {current_user['id']}")
        db = load_db()
        favorites = [f for f in db['favorites'] if f['userId'] == current_user['id']]
        logger.info(f"Найдено {len(favorites)} избранных блюд")
        
        # Получаем полную информацию о блюдах
        favorite_dishes = []
        for fav in favorites:
            dish = next((d for d in db['dishes'] if d['id'] == fav['dishId']), None)
            if dish:
                favorite_dishes.append(dish)
        
        logger.info(f"Возвращаем {len(favorite_dishes)} блюд")
        return jsonify(favorite_dishes)
    except Exception as e:
        logger.error(f"Ошибка при получении избранного: {str(e)}")
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

@app.route('/favorites', methods=['POST'])
@token_required
def add_to_favorites(current_user):
    try:
        data = request.get_json()
        if not data or 'dishId' not in data:
            logger.error("Не указан dishId в запросе")
            return jsonify({'error': 'Необходимо указать dishId'}), 400

        dish_id = data['dishId']
        db = load_db()
        
        # Проверяем, существует ли блюдо
        dish = next((d for d in db['dishes'] if d['id'] == dish_id), None)
        if not dish:
            logger.error(f"Блюдо с ID {dish_id} не найдено")
            return jsonify({'error': 'Блюдо не найдено'}), 404
        
        # Проверяем, не добавлено ли уже в избранное
        existing = next((f for f in db['favorites'] if f['userId'] == current_user['id'] and f['dishId'] == dish_id), None)
        if existing:
            logger.warning(f"Блюдо {dish_id} уже в избранном пользователя {current_user['id']}")
            return jsonify({'error': 'Блюдо уже в избранном'}), 400
        
        # Добавляем в избранное
        favorite = {
            'id': get_next_id('favorites'),
            'userId': current_user['id'],
            'dishId': dish_id
        }
        db['favorites'].append(favorite)
        save_db(db)
        logger.info(f"Блюдо {dish_id} добавлено в избранное пользователя {current_user['id']}")
        return jsonify(favorite), 201
    except Exception as e:
        logger.error(f"Ошибка при добавлении в избранное: {str(e)}")
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

@app.route('/favorites/<int:dish_id>', methods=['DELETE'])
@token_required
def remove_from_favorites(current_user, dish_id):
    try:
        db = load_db()
        favorite = next((f for f in db['favorites'] if f['userId'] == current_user['id'] and f['dishId'] == dish_id), None)
        if not favorite:
            logger.error(f"Блюдо {dish_id} не найдено в избранном пользователя {current_user['id']}")
            return jsonify({'error': 'Блюдо не найдено в избранном'}), 404
        
        db['favorites'].remove(favorite)
        save_db(db)
        logger.info(f"Блюдо {dish_id} удалено из избранного пользователя {current_user['id']}")
        return '', 204
    except Exception as e:
        logger.error(f"Ошибка при удалении из избранного: {str(e)}")
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

# Эндпоинты для корзины
@app.route('/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    try:
        logger.info(f"Получение корзины для пользователя {current_user['id']}")
        db = load_db()
        cart_items = [c for c in db['cart'] if c['userId'] == current_user['id']]
        logger.info(f"Найдено {len(cart_items)} товаров в корзине")
        
        # Получаем полную информацию о блюдах
        cart_with_details = []
        for item in cart_items:
            dish = next((d for d in db['dishes'] if d['id'] == item['dishId']), None)
            if dish:
                cart_with_details.append({
                    **dish,
                    'quantity': item['quantity'],
                    'cartItemId': item['id']
                })
        
        logger.info(f"Возвращаем {len(cart_with_details)} товаров с деталями")
        return jsonify(cart_with_details)
    except Exception as e:
        logger.error(f"Ошибка при получении корзины: {str(e)}")
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

@app.route('/cart', methods=['POST'])
@token_required
def add_to_cart(current_user):
    db = load_db()
    data = request.get_json()
    dish_id = data.get('dishId')
    quantity = data.get('quantity', 1)
    
    # Проверяем, существует ли блюдо
    dish = next((d for d in db['dishes'] if d['id'] == dish_id), None)
    if not dish:
        logger.error(f"Блюдо с ID {dish_id} не найдено")
        return jsonify({'error': 'Блюдо не найдено'}), 404
    
    # Проверяем, есть ли уже в корзине
    existing = next((c for c in db['cart'] if c['userId'] == current_user['id'] and c['dishId'] == dish_id), None)
    if existing:
        existing['quantity'] += quantity
    else:
        cart_item = {
            'id': len(db['cart']) + 1,
            'userId': current_user['id'],
            'dishId': dish_id,
            'quantity': quantity
        }
        db['cart'].append(cart_item)
    
    save_db(db)
    logger.info(f"Товар {dish_id} добавлен в корзину пользователя {current_user['id']}, количество: {quantity}")
    return jsonify(existing if existing else cart_item), 201

@app.route('/cart/<int:dish_id>', methods=['PUT'])
@token_required
def update_cart_item(current_user, dish_id):
    try:
        logger.info(f"Обновление количества товара {dish_id} для пользователя {current_user['id']}")
        db = load_db()
        
        # Находим товар в корзине
        cart_item = next((c for c in db['cart'] if c['userId'] == current_user['id'] and c['dishId'] == dish_id), None)
        if not cart_item:
            logger.warning(f"Товар {dish_id} не найден в корзине пользователя {current_user['id']}")
            return jsonify({'error': 'Товар не найден в корзине'}), 404
        
        # Получаем новое количество
        data = request.get_json()
        quantity = data.get('quantity')
        
        if quantity is None:
            logger.warning("Не указано количество товара")
            return jsonify({'error': 'Необходимо указать количество'}), 400
            
        if quantity <= 0:
            # Удаляем товар из корзины
            db['cart'].remove(cart_item)
            logger.info(f"Товар {dish_id} удален из корзины пользователя {current_user['id']}")
        else:
            # Обновляем количество
            cart_item['quantity'] = quantity
            logger.info(f"Количество товара {dish_id} обновлено до {quantity}")
        
        save_db(db)
        return jsonify(cart_item)
    except Exception as e:
        logger.error(f"Ошибка при обновлении корзины: {str(e)}")
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

@app.route('/cart/<int:dish_id>', methods=['DELETE'])
@token_required
def remove_from_cart(current_user, dish_id):
    db = load_db()
    cart_item = next((c for c in db['cart'] if c['userId'] == current_user['id'] and c['dishId'] == dish_id), None)
    if not cart_item:
        logger.error(f"Товар {dish_id} не найден в корзине пользователя {current_user['id']}")
        return jsonify({'error': 'Товар не найден в корзине'}), 404
    
    db['cart'].remove(cart_item)
    save_db(db)
    logger.info(f"Товар {dish_id} удален из корзины пользователя {current_user['id']}")
    return '', 204

# Эндпоинт для аутентификации
@app.route('/auth/login', methods=['POST'])
def login():
    logger.info("Получен POST запрос на /auth/login")
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            logger.error("Не указаны email или пароль")
            return jsonify({'error': 'Необходимо указать email и пароль'}), 400
            
        db = load_db()
        user = next((user for user in db['users'] if user['email'] == data['email']), None)
        
        if not user or user['password'] != data['password']:
            logger.error("Неверный email или пароль")
            return jsonify({'error': 'Неверный email или пароль'}), 401
            
        # Создаем JWT токен
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.utcnow() + timedelta(days=1)
        }, JWT_SECRET, algorithm='HS256')
        
        # Удаляем пароль из данных пользователя
        user_data = {k: v for k, v in user.items() if k != 'password'}
        user_data['token'] = token
        
        logger.info(f"Успешный вход пользователя {user['id']}")
        return jsonify({
            'token': token,
            'user': user_data
        })
        
    except Exception as e:
        logger.error(f"Ошибка при аутентификации: {str(e)}")
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

# Обновляем эндпоинт для отзывов
@app.route('/feedback', methods=['POST'])
@token_required
def create_feedback(current_user):
    db = load_db()
    data = request.get_json()
    # Проверяем, существует ли блюдо
    dish = next((d for d in db['dishes'] if d['id'] == data['dishId']), None)
    if not dish:
        logger.error(f"Блюдо с ID {data['dishId']} не найдено")
        return jsonify({'error': 'Блюдо не найдено'}), 404
    feedback = {
        'id': len(db['feedback']) + 1,
        'dishId': data['dishId'],
        'userId': current_user['id'],
        'rating': data['rating'],
        'comment': data['comment'],
        'createdAt': datetime.now().isoformat(),
        'status': 'pending'
    }
    db['feedback'].append(feedback)
    save_db(db)
    logger.info(f"Создан новый отзыв: {feedback['id']}")
    return jsonify(feedback), 201

@app.route('/feedback', methods=['GET'])
def get_feedback():
    db = load_db()
    feedback = db.get('feedback', [])
    user_id = request.args.get('userId', type=int)
    if user_id is not None:
        feedback = [f for f in feedback if f['userId'] == user_id]
    return jsonify(feedback)

@app.route('/feedback/<int:id>', methods=['PATCH'])
@token_required
def update_feedback(current_user, id):
    if current_user['role'] != 'admin':
        logger.error(f"Пользователь {current_user['id']} не имеет прав администратора")
        return jsonify({"error": "Требуются права администратора"}), 403

    db = load_db()
    feedback = next((f for f in db['feedback'] if f['id'] == id), None)
    
    if not feedback:
        logger.error(f"Отзыв с ID {id} не найден")
        return jsonify({"error": "Отзыв не найден"}), 404
        
    data = request.get_json()
    if 'status' in data:
        feedback['status'] = data['status']
        
    save_db(db)
    logger.info(f"Статус отзыва {id} обновлен: {data['status']}")
    return jsonify(feedback)

@app.route('/feedback/<int:id>', methods=['DELETE'])
@token_required
def delete_feedback(current_user, id):
    if current_user['role'] != 'admin':
        logger.error(f"Пользователь {current_user['id']} не имеет прав администратора")
        return jsonify({"error": "Требуются права администратора"}), 403

    db = load_db()
    feedback = next((f for f in db['feedback'] if f['id'] == id), None)
    
    if not feedback:
        logger.error(f"Отзыв с ID {id} не найден")
        return jsonify({"error": "Отзыв не найден"}), 404
        
    db['feedback'].remove(feedback)
    save_db(db)
    logger.info(f"Отзыв {id} удален")
    return jsonify({"message": "Feedback deleted"}), 200

@app.route('/orders', methods=['POST'])
@token_required
def create_order(current_user):
    try:
        logger.info("Получен POST запрос на /orders")
        logger.debug(f"Заголовки запроса: {dict(request.headers)}")
        logger.debug(f"Данные запроса: {request.get_data()}")
        
        if not request.is_json:
            logger.error("Получен не JSON запрос")
            return jsonify({"error": "Требуется JSON"}), 400
            
        order_data = request.json
        logger.debug(f"Данные заказа: {order_data}")
        
        db = load_db()
        
        # Создаем новый заказ
        new_order = {
            "id": get_next_id('orders'),
            "userId": current_user['id'],
            "items": order_data['items'],
            "totalAmount": order_data['totalAmount'],
            "status": order_data['status'],
            "createdAt": order_data['createdAt']
        }
        
        # Добавляем заказ в базу данных
        if 'orders' not in db:
            db['orders'] = []
        db['orders'].append(new_order)
        
        # Очищаем корзину пользователя
        db['cart'] = [item for item in db['cart'] if item['userId'] != current_user['id']]
        
        save_db(db)
        logger.info(f"Создан новый заказ: {new_order['id']}")
        
        return jsonify(new_order), 201
    except Exception as e:
        logger.error(f"Ошибка при создании заказа: {str(e)}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

@app.route('/orders', methods=['GET'])
def get_orders():
    db = load_db()
    user_id = request.args.get('userId', type=int)
    orders = db.get('orders', [])
    if user_id is not None:
        orders = [order for order in orders if order['userId'] == user_id]
    return jsonify(orders)

@app.route('/cart/clear', methods=['DELETE'])
@token_required
def clear_cart(current_user):
    try:
        logger.info(f"Очистка корзины для пользователя {current_user['id']}")
        db = load_db()
        
        # Логируем содержимое корзины перед очисткой
        cart_items = [item for item in db['cart'] if item['userId'] == current_user['id']]
        logger.debug(f"Товары в корзине перед очисткой: {cart_items}")
        
        # Удаляем все товары из корзины пользователя
        db['cart'] = [item for item in db['cart'] if item['userId'] != current_user['id']]
        
        save_db(db)
        logger.info(f"Корзина пользователя {current_user['id']} очищена")
        
        return jsonify({"message": "Корзина очищена"}), 200
    except Exception as e:
        logger.error(f"Ошибка при очистке корзины: {str(e)}")
        return jsonify({"error": "Внутренняя ошибка сервера"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)