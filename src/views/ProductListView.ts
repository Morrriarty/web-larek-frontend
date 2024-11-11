// src/views/ProductListView.ts

import { Product } from '../types';
import { EventEmitter } from '../utils/EventEmitter';
import { CDN_URL } from '../utils/constants';

/**
 * Класс `ProductListView` отвечает за отображение списка продуктов.
 */
export class ProductListView {
  private container: HTMLElement;
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;

  /**
   * Создает экземпляр `ProductListView`.
   * @param container - Контейнер для отображения списка продуктов.
   * @param emitter - Экземпляр `EventEmitter` для управления событиями.
   */
  constructor(container: HTMLElement, emitter: EventEmitter) {
    this.container = container;
    this.emitter = emitter;
    const templateElement = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #card-catalog not found');
    }
    this.template = templateElement;
  }

  /**
   * Рендерит список продуктов.
   * @param products - Массив продуктов для отображения.
   */
  render(products: Product[]): void {
    this.container.innerHTML = '';
    products.forEach((product) => {
      const card = this.createProductCard(product);
      this.container.appendChild(card);
    });
  }

  /**
   * Создает карточку продукта.
   * @param product - Объект продукта.
   * @returns Элемент карточки продукта.
   */
  private createProductCard(product: Product): HTMLElement {
    const cardElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Обновляем данные карточки
    const cardTitle = cardElement.querySelector('.card__title');
    if (cardTitle) {
      cardTitle.textContent = product.title;
    }

    const cardImage = cardElement.querySelector('.card__image') as HTMLImageElement;
    if (cardImage) {
      cardImage.src = `${CDN_URL}/${product.image}`;
      cardImage.alt = product.title;
    }

    const cardPrice = cardElement.querySelector('.card__price');
    if (cardPrice) {
      cardPrice.textContent = `${product.price ?? 0} синапсов`;
    }

    const cardCategory = cardElement.querySelector('.card__category');
    if (cardCategory) {
      cardCategory.textContent = product.category;
    }

    // Обработчик клика на карточку
    cardElement.addEventListener('click', () => {
      this.emitter.emit('productSelected', product.id);
    });

    return cardElement;
  }
}
