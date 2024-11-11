// src/views/ProductDetailView.ts

import { Product } from '../types';
import { EventEmitter } from '../utils/EventEmitter';
import { CDN_URL } from '../utils/constants';

/**
 * Класс `ProductDetailView` отвечает за отображение деталей продукта.
 */
export class ProductDetailView {
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;

  /**
   * Создает экземпляр `ProductDetailView`.
   * @param emitter - Экземпляр `EventEmitter` для управления событиями.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    const templateElement = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #card-preview not found');
    }
    this.template = templateElement;
  }

  /**
   * Рендерит детали продукта.
   * @param product - Объект продукта для отображения.
   * @returns Элемент с деталями продукта.
   */
  render(product: Product): HTMLElement {
    const detailElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Обновляем данные продукта
    const cardTitle = detailElement.querySelector('.card__title');
    if (cardTitle) {
      cardTitle.textContent = product.title;
    }

    const cardImage = detailElement.querySelector('.card__image') as HTMLImageElement;
    if (cardImage) {
      cardImage.src = `${CDN_URL}/${product.image}`;
      cardImage.alt = product.title;
    }

    const cardPrice = detailElement.querySelector('.card__price');
    if (cardPrice) {
      cardPrice.textContent = `${product.price ?? 0} синапсов`;
    }

    const cardCategory = detailElement.querySelector('.card__category');
    if (cardCategory) {
      cardCategory.textContent = product.category;
    }

    const cardText = detailElement.querySelector('.card__text');
    if (cardText) {
      cardText.textContent = product.description;
    }

    const button = detailElement.querySelector('.button.card__button') as HTMLButtonElement;
    if (button) {
      button.addEventListener('click', () => {
        this.emitter.emit('addToCart', product);
      });
    }

    return detailElement;
  }
}
