Инструкция по взаимодействию с API
API предоставляет методы для управления товарами и заказами, а также для авторизации. Вот пошаговая инструкция для разработчиков фронтенда о том, как взаимодействовать с этим API.

1. Авторизация
Запрос на получение JWT токена
Для выполнения защищенных запросов необходимо получить JWT токен, отправив POST запрос на /api/login.

Эндпоинт: POST /api/login

Пример тела запроса:

json
Копировать код
{
  "username": "admin",
  "password": "password"
}
Пример успешного ответа:

json
Копировать код
{
  "token": "your_jwt_token"
}
Сохраните полученный токен для последующего использования в заголовках запросов.

2. Управление товарами
Получение списка товаров
Эндпоинт: GET /api/products

Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products')
  .then(response => response.json())
  .then(data => console.log(data));
Поиск товаров
Эндпоинт: GET /api/products/search

Параметры запроса:

name (опционально): Имя товара.
minPrice (опционально): Минимальная цена.
maxPrice (опционально): Максимальная цена.
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products/search?name=Product&minPrice=50&maxPrice=200')
  .then(response => response.json())
  .then(data => console.log(data));
Добавление нового товара
Эндпоинт: POST /api/products

Требуется авторизация: Bearer your_jwt_token

Пример тела запроса:

json
Копировать код
{
  "id": "product1",
  "name": "Product 1",
  "description": "Description for product 1",
  "bundles": [
    {
      "name": "Bundle 1",
      "price": 100
    },
    {
      "name": "Bundle 2",
      "price": 200
    }
  ]
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your_jwt_token`
  },
  body: JSON.stringify({
    id: 'product1',
    name: 'Product 1',
    description: 'Description for product 1',
    bundles: [
      { name: 'Bundle 1', price: 100 },
      { name: 'Bundle 2', price: 200 }
    ]
  })
});
Обновление существующего товара
Эндпоинт: PUT /api/products/:id

Требуется авторизация: Bearer your_jwt_token

Параметры пути:

:id: ID товара, который нужно обновить.
Пример тела запроса:

json
Копировать код
{
  "id": "product1",
  "name": "Updated Product 1",
  "description": "Updated description for product 1",
  "bundles": [
    {
      "name": "Updated Bundle 1",
      "price": 150
    }
  ]
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products/product1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your_jwt_token`
  },
  body: JSON.stringify({
    id: 'product1',
    name: 'Updated Product 1',
    description: 'Updated description for product 1',
    bundles: [
      { name: 'Updated Bundle 1', price: 150 }
    ]
  })
});
Удаление товара
Эндпоинт: DELETE /api/products/:id

Требуется авторизация: Bearer your_jwt_token

Параметры пути:

:id: ID товара, который нужно удалить.
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products/product1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer your_jwt_token`
  }
});
3. Управление заказами
Получение списка заказов
Эндпоинт: GET /api/orders

Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/orders')
  .then(response => response.json())
  .then(data => console.log(data));
Создание нового заказа
Эндпоинт: POST /api/orders

Пример тела запроса:

json
Копировать код
{
  "user_email": "user@example.com",
  "items": [
    {
      "id": "item1",
      "name": "Product 1",
      "description": "Description for product 1",
      "quantity": 1,
      "referralLink": "http://example.com/referral"
    }
  ],
  "total_amount": 100
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_email: 'user@example.com',
    items: [
      {
        id: 'item1',
        name: 'Product 1',
        description: 'Description for product 1',
        quantity: 1,
        referralLink: 'http://example.com/referral'
      }
    ],
    total_amount: 100
  })
});
Обновление статуса заказа
Эндпоинт: PUT /api/orders/:id/status

Требуется авторизация: Bearer your_jwt_token

Параметры пути:

:id: ID заказа, статус которого нужно обновить.
Пример тела запроса:

json
Копировать код
{
  "status": "Paid"
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/orders/order1/status', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your_jwt_token`
  },
  body: JSON.stringify({
    status: 'Paid'
  })
});
Примечания
URL сервера: В примерах выше используется URL http://localhost:3001. Убедитесь, что ваш сервер запущен и доступен по этому адресу. Если сервер запущен на другом адресе или порту, измените URL соответствующим образом.

Токен авторизации: Для выполнения защищенных запросов используйте JWT токен, полученный при авторизации. Добавляйте его в заголовок Authorization в формате Bearer your_jwt_token.

Формат данных: Все запросы, которые требуют тело запроса, используют формат JSON. Убедитесь, что заголовок Content-Type установлен на application/json.

Эта инструкция поможет разработчикам фронтенда взаимодействовать с API для управления товарами и заказами в вашем проекте.

ты можешь эту инструкцию переместить в файл readme.md
ChatGPT
Конечно, вот обновленный файл README.md с инструкцией для разработчиков фронтенда:

markdown
Копировать код
# API для управления товарами и заказами

## Установка

Установите необходимые зависимости с помощью npm:

```bash
npm install express body-parser jsonwebtoken
Запустите сервер:

bash
Копировать код
node server.js
Сервер будет доступен по адресу: http://localhost:3001.

Эндпоинты API
Авторизация
POST /api/login
Описание: Получение JWT токена для авторизации.

Пример тела запроса:

json
Копировать код
{
  "username": "admin",
  "password": "password"
}
Пример успешного ответа:

json
Копировать код
{
  "token": "your_jwt_token"
}
Товары
GET /api/products
Описание: Получение списка всех товаров.

Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products')
  .then(response => response.json())
  .then(data => console.log(data));
GET /api/products/search
Описание: Поиск товаров по имени и диапазону цен.

Параметры запроса:
name (опционально): Имя товара.
minPrice (опционально): Минимальная цена.
maxPrice (опционально): Максимальная цена.
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products/search?name=Product&minPrice=50&maxPrice=200')
  .then(response => response.json())
  .then(data => console.log(data));
POST /api/products
Описание: Добавление нового товара (требуется авторизация).

Пример тела запроса:

json
Копировать код
{
  "id": "product1",
  "name": "Product 1",
  "description": "Description for product 1",
  "bundles": [
    {
      "name": "Bundle 1",
      "price": 100
    },
    {
      "name": "Bundle 2",
      "price": 200
    }
  ]
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your_jwt_token`
  },
  body: JSON.stringify({
    id: 'product1',
    name: 'Product 1',
    description: 'Description for product 1',
    bundles: [
      { name: 'Bundle 1', price: 100 },
      { name: 'Bundle 2', price: 200 }
    ]
  })
});
PUT /api/products/
Описание: Обновление существующего товара (требуется авторизация).

Параметры пути:

:id: ID товара, который нужно обновить.
Пример тела запроса:

json
Копировать код
{
  "id": "product1",
  "name": "Updated Product 1",
  "description": "Updated description for product 1",
  "bundles": [
    {
      "name": "Updated Bundle 1",
      "price": 150
    }
  ]
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products/product1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your_jwt_token`
  },
  body: JSON.stringify({
    id: 'product1',
    name: 'Updated Product 1',
    description: 'Updated description for product 1',
    bundles: [
      { name: 'Updated Bundle 1', price: 150 }
    ]
  })
});
DELETE /api/products/
Описание: Удаление существующего товара (требуется авторизация).

Параметры пути:

:id: ID товара, который нужно удалить.
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/products/product1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer your_jwt_token`
  }
});
Заказы
GET /api/orders
Описание: Получение списка всех заказов.

Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/orders')
  .then(response => response.json())
  .then(data => console.log(data));
POST /api/orders
Описание: Создание нового заказа.

Пример тела запроса:

json
Копировать код
{
  "user_email": "user@example.com",
  "items": [
    {
      "id": "item1",
      "name": "Product 1",
      "description": "Description for product 1",
      "quantity": 1,
      "referralLink": "http://example.com/referral"
    }
  ],
  "total_amount": 100
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_email: 'user@example.com',
    items: [
      {
        id: 'item1',
        name: 'Product 1',
        description: 'Description for product 1',
        quantity: 1,
        referralLink: 'http://example.com/referral'
      }
    ],
    total_amount: 100
  })
});
PUT /api/orders/
/status
Описание: Обновление статуса заказа (требуется авторизация).

Параметры пути:

:id: ID заказа, статус которого нужно обновить.
Пример тела запроса:

json
Копировать код
{
  "status": "Paid"
}
Пример использования:

javascript
Копировать код
fetch('http://localhost:3001/api/orders/order1/status', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer your_jwt_token`
  },
  body: JSON.stringify({
    status: 'Paid'
  })
});
Примечания
URL сервера: В примерах выше используется URL http://localhost:3001. Убедитесь, что ваш сервер запущен и доступен по этому адресу. Если сервер запущен на другом адресе или порту, измените URL соответствующим образом.

Токен авторизации: Для выполнения защищенных запросов используйте JWT токен, полученный при авторизации. Добавляйте его в заголовок Authorization в формате Bearer your_jwt_token.

Формат данных: Все запросы, которые требуют тело запроса, используют формат JSON. Убедитесь, что заголовок Content-Type установлен на application/json.

Эта инструкция поможет разработчикам фронтенда взаимодействовать с API для управления товарами и заказами в вашем проекте.

