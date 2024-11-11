// src/types/index.ts

/**
 * Интерфейс продукта.
 */
export interface Product {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/**
 * Интерфейс списка продуктов.
 */
export interface ProductList {
  total: number;
  items: Product[];
}

/**
 * Тип способа оплаты.
 */
export type PaymentMethod = 'online' | 'cash';

/**
 * Интерфейс заказа.
 */
export interface Order {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

/**
 * Интерфейс ответа сервера на создание заказа.
 */
export interface OrderResponse {
  id: string;
  total: number;
}

/**
 * Интерфейс ошибки API.
 */
export interface APIError {
  error: string;
}

/**
 * Интерфейс клиента API.
 */
export interface APIClient {
  getProducts(): Promise<ProductList>;
  getProduct(id: string): Promise<Product>;
  createOrder(order: Order): Promise<OrderResponse>;
}

/**
 * Интерфейс `EventEmitter` для управления событиями.
 */
export interface EventEmitter {
  on(event: string, listener: Function): void;
  off(event: string, listener: Function): void;
  emit(event: string, ...args: any[]): void;
}

/**
 * Интерфейс для моделей данных.
 */
export interface Model {
  // Методы и свойства модели.
}

/**
 * Интерфейс для отображений.
 */
export interface View {
  // Методы и свойства отображения.
}

/**
 * Интерфейс для контроллера.
 */
export interface Controller {
  // Методы и свойства контроллера.
}
