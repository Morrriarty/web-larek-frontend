// src/models/ProductModel.ts

import { APIClient, Product } from '../types';
import { EventEmitter } from '../utils/EventEmitter';

/**
 * Класс `ProductModel` отвечает за получение и хранение списка продуктов.
 */
export class ProductModel {
  private apiClient: APIClient;
  private emitter: EventEmitter;
  private products: Product[] = [];

  /**
   * Создает экземпляр `ProductModel`.
   * @param apiClient - Экземпляр `APIClient` для взаимодействия с API.
   * @param emitter - Экземпляр `EventEmitter` для управления событиями.
   */
  constructor(apiClient: APIClient, emitter: EventEmitter) {
    this.apiClient = apiClient;
    this.emitter = emitter;
  }

  /**
   * Загружает список продуктов с сервера.
   */
  async fetchProducts(): Promise<void> {
    try {
      const productList = await this.apiClient.getProducts();
      this.products = productList.items;
      this.emitter.emit('productsLoaded', this.products);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    }
  }

  /**
   * Получает продукт по его ID из загруженного списка.
   * @param id - Идентификатор продукта.
   * @returns Объект продукта или undefined, если не найден.
   */
  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  /**
   * Возвращает список загруженных продуктов.
   * @returns Массив продуктов.
   */
  getProducts(): Product[] {
    return this.products;
  }
}
