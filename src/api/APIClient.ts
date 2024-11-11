// src/api/APIClient.ts

import {
  APIClient,
  Product,
  ProductList,
  Order,
  OrderResponse,
  APIError,
} from '../types';

/**
 * Класс `APIClientImpl` реализует интерфейс `APIClient` и отвечает за взаимодействие с API сервера.
 */
export class APIClientImpl implements APIClient {
  private baseUrl: string;

  /**
   * Создает экземпляр `APIClientImpl`.
   * @param baseUrl - Базовый URL API.
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получает список продуктов с сервера.
   * @returns Promise с данными списка продуктов.
   */
  async getProducts(): Promise<ProductList> {
    const response = await fetch(`${this.baseUrl}/product/`);
    if (!response.ok) {
      throw new Error('Не удалось получить список товаров');
    }
    const data = await response.json();
    return data as ProductList;
  }

  /**
   * Получает информацию о продукте по его ID.
   * @param id - Идентификатор продукта.
   * @returns Promise с данными продукта.
   */
  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/product/${id}`);
    if (!response.ok) {
      throw new Error('Товар не найден');
    }
    const data = await response.json();
    return data as Product;
  }

  /**
   * Создает заказ на сервере.
   * @param order - Объект заказа.
   * @returns Promise с данными ответа сервера о созданном заказе.
   */
  async createOrder(order: Order): Promise<OrderResponse> {
    const response = await fetch(`${this.baseUrl}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      const errorData: APIError = await response.json();
      throw new Error(errorData.error || 'Не удалось создать заказ');
    }
    const data = await response.json();
    return data as OrderResponse;
  }
}
