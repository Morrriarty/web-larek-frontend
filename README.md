https://github.com/Morrriarty/web-larek-frontend

# Проектная работа 7-8 "Веб-ларек" Онлайн-магазин на TypeScript с использованием MVC

## 1.Описание проекта

Это проект онлайн-магазина, реализованный на TypeScript с использованием архитектурного паттерна MVC (Model-View-Controller). Приложение позволяет пользователям просматривать список товаров, добавлять их в корзину, оформлять заказы и взаимодействовать с интерфейсом, основанным на событиях.

## 2.Используемый стек технологий

- Язык программирования: TypeScript
- Сборка проекта: Webpack
- Модульная система: ES6 Modules
- Стили: SCSS (SASS)
- Взаимодействие с API: Fetch API
- Паттерны проектирования: MVC (Model-View-Controller), Observer Pattern

## 3.Инструкция по сборке и запуску

- Установка зависимостей и запуск проекта:

```
npm install
npm run start
```

или

```
yarn
yarn start
```

- Сборка проекта для продакшена:

```
npm run build
```

или

```
yarn build
```

## 4.Описание архитектуры проекта

Проект построен с использованием архитектурного паттерна MVC (Model-View-Controller), который разделяет приложение на три взаимосвязанные компоненты:
- Model (Модель): Управляет данными и бизнес-логикой.
- View (Представление): Отвечает за отображение данных пользователю.
- Controller (Контроллер): Обрабатывает ввод пользователя и взаимодействует с Моделью и Представлением.

## Основные компоненты

### Модели
- ProductModel (файл: /src/models/ProductModel.ts)
* Назначение: Хранит данные о продуктах и предоставляет методы для доступа к ним.
* Конструктор:

1. 
```
constructor(emitter: EventEmitter)
```

2. emitter: EventEmitter — экземпляр EventEmitter для взаимодействия с другими компонентами через события.

* Методы:
+ setProducts(products: Product[]): void — устанавливает список продуктов.
+ getProductById(id: string): Product | undefined — возвращает продукт по его ID.
+ getProducts(): Product[] — возвращает список всех продуктов.
+ CartModel (файл: /src/models/CartModel.ts)

* Назначение: Управляет состоянием корзины и деталями заказа.

* Конструктор:

1. 
```
constructor(emitter: EventEmitter)
```

2. emitter: EventEmitter — экземпляр EventEmitter для событийного взаимодействия.

* Методы:
+ addItem(item: Product): void — добавляет продукт в корзину.
+ removeItem(id: string): void — удаляет продукт из корзины по его ID.
+ getItems(): Product[] — возвращает список товаров в корзине.
+ getTotal(): number — вычисляет общую стоимость товаров в корзине.
+ clearCart(): void — очищает корзину и сбрасывает детали заказа.
+ setOrderDetails(details: OrderDetails): void — устанавливает детали заказа (способ оплаты и адрес).
+ getOrderDetails(): OrderDetails — возвращает детали заказа.
+ hasItem(id: string): boolean — проверяет наличие товара в корзине по его ID.

### Представления

- ProductListView (файл: /src/views/ProductListView.ts)

* Назначение: Отображает список продуктов на главной странице.

* Конструктор:

1. 

```
constructor(container: HTMLElement, emitter: EventEmitter)
```

2. container: HTMLElement — HTML-элемент, в котором будут отображаться продукты.
3. emitter: EventEmitter — экземпляр EventEmitter для событийного взаимодействия.

* Методы:
+ render(products: Product[]): void — рендерит список продуктов.
+ private createProductCard(product: Product): HTMLElement — создает карточку продукта для отображения.
+ ProductDetailView (файл: /src/views/ProductDetailView.ts)

* Назначение: Отображает детальную информацию о выбранном продукте в модальном окне.

* Конструктор:

1. 

```
constructor(emitter: EventEmitter, isProductInCart: (productId: string) => boolean)
```

2. emitter: EventEmitter — экземпляр EventEmitter для событийного взаимодействия.
3. isProductInCart: (productId: string) => boolean — функция для проверки наличия продукта в корзине.

* Методы:
+ render(product: Product): HTMLElement — рендерит детали продукта.
+ private getCategoryClass(category: string): string | null — возвращает CSS-класс для категории продукта.

- CartView (файл: /src/views/CartView.ts)

* Назначение: Отображает содержимое корзины в модальном окне.

* Конструктор:

1. 
```
constructor(emitter: EventEmitter)
```

2. emitter: EventEmitter — экземпляр EventEmitter для событийного взаимодействия.

* Методы:
+ render(items: Product[], total: number): HTMLElement — рендерит корзину с товарами и общей стоимостью.

- OrderForm (файл: /src/views/OrderForm.ts)

* Назначение: Отвечает за отображение и валидацию формы заказа (выбор способа оплаты и ввод адреса).

* Конструктор:

1. 
```
constructor(emitter: EventEmitter)
```

2. emitter: EventEmitter — экземпляр EventEmitter для событийного взаимодействия.

* Методы:
+ getForm(): HTMLElement — возвращает форму заказа для отображения.
+ validateForm(): boolean — валидирует форму заказа и отображает ошибки.
+ protected onSubmit(): void — обработчик отправки формы заказа.
+ ContactsForm (файл: /src/views/ContactsForm.ts)

* Назначение: Отвечает за отображение и валидацию формы контактных данных (email и телефон).

* Конструктор:

1. 

```
constructor(emitter: EventEmitter)
```

2. emitter: EventEmitter — экземпляр EventEmitter для событийного взаимодействия.

* Методы:
+ getForm(): HTMLElement — возвращает форму контактных данных для отображения.
+ validateForm(): boolean — валидирует форму и отображает ошибки.
+ protected onSubmit(): void — обработчик отправки формы контактных данных.

- Modal (файл: /src/views/Modal.ts)

* Назначение: Управляет отображением модальных окон (открытие, закрытие, установка содержимого).

* Конструктор:

1. 
```
constructor(modalElement: HTMLElement, emitter: EventEmitter)
```

2. modalElement: HTMLElement — HTML-элемент модального окна.
3. emitter: EventEmitter — экземпляр EventEmitter для событийного взаимодействия.

* Методы:
+ open(): void — открывает модальное окно.
+ close(): void — закрывает модальное окно.
+ setContent(content: HTMLElement, contentType?: string): void — устанавливает содержимое модального окна.
+ isOpen(): boolean — проверяет, открыто ли модальное окно.
+ getContentType(): string | null — возвращает тип текущего содержимого модального окна.

### Контроллер

- Главный контроллер приложения (файл: /src/index.ts)

* Назначение: Инициализирует приложение, связывает модели и представления, обрабатывает пользовательские действия и события.

+ Основные функции:

1. Инициализирует модели (ProductModel, CartModel) и представления (ProductListView, ProductDetailView, CartView).
2. Устанавливает обработчики событий для взаимодействия между компонентами.
3. Обрабатывает события пользовательского ввода и обновления данных.
4. Управляет потоком данных и взаимодействием с API через APIClientImpl.

### Утилиты

- EventEmitter (файл: /src/components/base/events.ts)

* Назначение: Обеспечивает обмен событиями между компонентами приложения, реализуя паттерн "наблюдатель" (Observer).

* Конструктор:

1. 

```
constructor()
```

* Методы:
+ on<T>(event: EventName, callback: Subscriber<T>): void — подписывается на событие.
+ off(event: EventName, callback: Function): void — отписывается от события.
+ emit<T>(event: string, data?: T): void — инициирует событие и вызывает соответствующие обработчики.
+ onAll(callback: (event: EmitterEvent) => void): void — подписывается на все события.
+ offAll(): void — отписывается от всех событий.

- APIClientImpl (файл: /src/api/APIClient.ts)

* Назначение: Реализует методы для взаимодействия с API сервера (получение товаров, создание заказа).

* Конструктор:

1. 

```
constructor(baseUrl: string)
```

2. baseUrl: string — базовый URL API сервера.

* Методы:
+ getProducts(): Promise<ProductList> — получает список продуктов.
+ getProduct(id: string): Promise<Product> — получает данные конкретного продукта по ID.
+ createOrder(order: Order): Promise<OrderResponse> — отправляет заказ на сервер.
+ Api (файл: /src/components/base/api.ts)

* Назначение: Базовый класс для выполнения HTTP-запросов к серверу.

* Конструктор:

1. 

```
constructor(baseUrl: string, options: RequestInit = {})
```

2. baseUrl: string — базовый URL API.
3. options: RequestInit — глобальные опции для всех запросов (опционально).

* Методы:
+ get(uri: string): Promise<object> — выполняет GET-запрос.
+ post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> — выполняет POST-запрос.
+ protected handleResponse(response: Response): Promise<object> — обрабатывает ответ от сервера.

- Page (файл: /src/utils/Page.ts)

* Назначение: Управляет общими элементами страницы, например, счётчиком товаров в корзине.

* Конструктор:

1. 

```
constructor()
```

* Методы:
+ setBasketCount(count: number): void — обновляет значение счётчика корзины.

### Взаимодействие компонентов

- Компоненты приложения взаимодействуют друг с другом через события, используя EventEmitter. Это обеспечивает слабое связывание и гибкость архитектуры.

* Поток данных:
+ Модели хранят данные и уведомляют об их изменении через события.
+ Представления слушают события и обновляют отображение данных.
+ Контроллер связывает модели и представления, устанавливая обработчики событий и управляя потоком данных.

### События приложения

* Основные события, используемые в приложении:
+ 'productsLoaded' — продукты загружены и готовы к отображению.
+ 'productSelected' — пользователь выбрал продукт для просмотра деталей.
+ 'addToCart' — продукт добавлен в корзину.
+ 'removeFromCart' — продукт удалён из корзины.
+ 'cartUpdated' — корзина обновлена (добавлен или удалён товар).
+ 'cartOpened' — корзина открыта для просмотра.
+ 'checkout' — пользователь инициировал оформление заказа.
+ 'orderStepCompleted' — первый шаг оформления заказа завершён (выбор способа оплаты и адреса).
+ 'formSubmitted' — форма контактных данных отправлена.
+ 'orderSuccess' — заказ успешно оформлен.
+ 'navigateToProducts' — навигация обратно к списку продуктов.

### Типы данных и их функции

- Product (файл: /src/types/index.ts)

* Описание: Представляет товар в магазине.

* Поля:

+ id: string — уникальный идентификатор продукта.
+ title: string — название продукта.
+ description: string — описание продукта.
+ image: string — URL изображения продукта.
+ category: string — категория продукта.
+ price: number | null — цена продукта (может быть null, если цена не указана).

- ProductList

* Описание: Содержит список продуктов и общее количество.

* Поля:
+ total: number — общее количество продуктов.
+ items: Product[] — массив продуктов.

- PaymentMethod

* Описание: Тип способа оплаты.

* Возможные значения: 'online' | 'cash'

- Order

* Описание: Представляет заказ пользователя.

* Поля:
+ payment: PaymentMethod — выбранный способ оплаты.
+ email: string — электронная почта покупателя.
+ phone: string — телефон покупателя.
+ address: string — адрес доставки.
+ total: number — общая стоимость заказа.
+ items: string[] — массив ID продуктов в заказе.

- OrderResponse

* Описание: Ответ сервера после создания заказа.

* Поля:
+ id: string — уникальный идентификатор заказа.
+ total: number — общая стоимость заказа.

- APIError

* Описание: Ошибка, возвращаемая API.

* Поля:
+ error: string — сообщение об ошибке.

### Процессы в приложении

* Загрузка и отображение продуктов

+ Инициализация: При запуске приложения ProductService получает список продуктов через APIClientImpl.
+ Обновление модели: ProductModel сохраняет полученные продукты и вызывает событие 'productsLoaded'.
+ Обновление представления: ProductListView слушает событие 'productsLoaded' и рендерит список продуктов на странице.

* Просмотр деталей продукта
+ Выбор продукта: Пользователь кликает на карточку продукта.
+ Событие: Вызывается событие 'productSelected' с ID продукта.
+ Отображение деталей: ProductDetailView получает данные продукта из ProductModel и отображает их в модальном окне.

* Управление корзиной
+ Добавление в корзину: Пользователь нажимает кнопку "В корзину" в деталях продукта.
+ Событие: Вызывается событие 'addToCart' с объектом продукта.
+ Обновление корзины: CartModel добавляет продукт и вызывает событие 'cartUpdated'.
+ Обновление представления: Счётчик корзины обновляется через Page.setBasketCount.

* Оформление заказа
+ Инициация: Пользователь открывает корзину и нажимает "Оформить".
+ Событие: Вызывается событие 'checkout'.
+ Форма заказа: OrderForm отображает форму выбора способа оплаты и адреса.
+ Валидация и отправка: После заполнения формы вызывается событие 'orderStepCompleted'.
+ Форма контактов: ContactsForm отображает форму ввода email и телефона.
+ Завершение заказа: После валидации вызывается событие 'formSubmitted', данные заказа отправляются на сервер через APIClientImpl.createOrder.
+ Успех: При успешном создании заказа вызывается событие 'orderSuccess', корзина очищается, отображается сообщение об успехе.

## 5.Автор

- Github: Morrriarty

## 6.Основные типы и интерфейсы проекта

### Интерфейсы

- Product

```
interface Product {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number | null;
}
```

- ProductList

```
interface ProductList {
total: number;
items: Product[];
}
```

- PaymentMethod

```
type PaymentMethod = 'online' | 'cash';
```

- Order

```
interface Order {
payment: PaymentMethod;
email: string;
phone: string;
address: string;
total: number;
items: string[];
}
```

- OrderResponse

```
interface OrderResponse {
id: string;
total: number;
}
```

- APIError

```
interface APIError {
error: string;
}
```

- APIClient

```
interface APIClient {
getProducts(): Promise<ProductList>;
getProduct(id: string): Promise<Product>;
createOrder(order: Order): Promise<OrderResponse>;
}
```

## 7.Дополнительные типы

- EventEmitter

Реализует подписку и уведомление об событиях.

- OrderDetails

```
interface OrderDetails {
payment: PaymentMethod;
address: string;
}
```