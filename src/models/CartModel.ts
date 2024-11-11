// src/models/CartModel.ts

import { EventEmitter } from '../utils/EventEmitter';
import { Product, PaymentMethod } from '../types';

/**
 * Интерфейс для деталей заказа.
 */
interface OrderDetails {
  payment: PaymentMethod;
  address: string;
}

/**
 * Класс `CartModel` отвечает за управление корзиной покупок.
 */
export class CartModel {
  private items: Product[] = [];
  private emitter: EventEmitter;
  private orderDetails: OrderDetails | null = null;

  /**
   * Создает экземпляр `CartModel`.
   * @param emitter - Экземпляр `EventEmitter` для управления событиями.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  /**
   * Добавляет товар в корзину.
   * @param item - Объект товара для добавления.
   */
  addItem(item: Product): void {
    this.items.push(item);
    this.emitter.emit('cartUpdated');
  }

  /**
   * Удаляет товар из корзины по его ID.
   * @param id - Идентификатор товара для удаления.
   */
  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.emitter.emit('cartUpdated');
  }

  /**
   * Возвращает список товаров в корзине.
   * @returns Массив товаров в корзине.
   */
  getItems(): Product[] {
    return this.items;
  }

  /**
   * Возвращает общую стоимость товаров в корзине.
   * @returns Суммарная стоимость товаров.
   */
  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  /**
   * Очищает корзину и сбрасывает детали заказа.
   */
  clearCart(): void {
    this.items = [];
    this.orderDetails = null;
    this.emitter.emit('cartUpdated');
  }

  /**
   * Устанавливает детали заказа.
   * @param details - Объект с деталями заказа.
   */
  setOrderDetails(details: OrderDetails): void {
    this.orderDetails = details;
  }

  /**
   * Возвращает детали заказа.
   * @returns Объект с деталями заказа.
   * @throws Ошибка, если детали заказа не установлены.
   */
  getOrderDetails(): OrderDetails {
    if (!this.orderDetails) {
      throw new Error('Детали заказа не установлены');
    }
    return this.orderDetails;
  }
}
