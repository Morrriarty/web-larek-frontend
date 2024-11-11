// src/views/CartView.ts

import { Product } from '../types';
import { EventEmitter } from '../utils/EventEmitter';
import { CDN_URL } from '../utils/constants';

/**
 * Класс `CartView` отвечает за отображение корзины.
 */
export class CartView {
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;
  private itemTemplate: HTMLTemplateElement;

  /**
   * Создает экземпляр `CartView`.
   * @param emitter - Экземпляр `EventEmitter` для управления событиями.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    const templateElement = document.getElementById('basket') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #basket not found');
    }
    this.template = templateElement;

    const itemTemplateElement = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!itemTemplateElement) {
      throw new Error('Template #card-basket not found');
    }
    this.itemTemplate = itemTemplateElement;
  }

  /**
   * Рендерит корзину с товарами.
   * @param items - Массив товаров в корзине.
   * @param total - Общая стоимость товаров.
   * @returns Элемент корзины для отображения.
   */
  render(items: Product[], total: number): HTMLElement {
    const basketElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const listElement = basketElement.querySelector('.basket__list') as HTMLElement;
    listElement.innerHTML = '';

    items.forEach((item, index) => {
      const listItem = this.itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

      const itemIndex = listItem.querySelector('.basket__item-index');
      if (itemIndex) {
        itemIndex.textContent = (index + 1).toString();
      }

      const itemTitle = listItem.querySelector('.card__title');
      if (itemTitle) {
        itemTitle.textContent = item.title;
      }

      const itemPrice = listItem.querySelector('.card__price');
      if (itemPrice) {
        itemPrice.textContent = `${item.price ?? 0} синапсов`;
      }

      const itemImage = listItem.querySelector('.card__image') as HTMLImageElement;
      if (itemImage) {
        itemImage.src = `${CDN_URL}/${item.image}`;
        itemImage.alt = item.title;
      }

      const deleteButton = listItem.querySelector('.basket__item-delete') as HTMLButtonElement;
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          this.emitter.emit('removeFromCart', item.id);
        });
      }

      listElement.appendChild(listItem);
    });

    const totalPriceElement = basketElement.querySelector('.basket__price');
    if (totalPriceElement) {
      totalPriceElement.textContent = `${total} синапсов`;
    }

    const checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;
    if (checkoutButton) {
      checkoutButton.disabled = items.length === 0;
      checkoutButton.addEventListener('click', () => {
        this.emitter.emit('checkout');
      });
    }

    return basketElement;
  }
}
