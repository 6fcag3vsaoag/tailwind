from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from uuid import uuid4

app = Flask(__name__)
CORS(app)  # Разрешить все источники

# Путь к db.json
DB_FILE = 'db.json'

# Чтение данных из db.json
def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    return {"dishes": [], "favorites": [], "cart": []}

# Сохранение данных в db.json
def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Получение следующего ID для ресурса
def get_next_id(resource):
    db = load_db()
    items = db.get(resource, [])
    return max([item['id'] for item in items], default=0) + 1

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

@app.route('/cart', methods=['GET'])
def get_cart_by_dish_id():
    db = load_db()
    dish_id = request.args.get('dishId')
    if dish_id:
        cart_items = [item for item in db['cart'] if str(item['dishId']) == dish_id]
        return jsonify(cart_items)
    return jsonify(db['cart'])

if __name__ == '__main__':
    app.run(debug=True, port=3000)