// src/views/Modal.ts

import { EventEmitter } from '../utils/EventEmitter';

/**
 * Класс `Modal` отвечает за управление модальным окном.
 */
export class Modal {
  private modalElement: HTMLElement;
  private emitter: EventEmitter;
  private contentType: string | null = null;

  /**
   * Создает экземпляр `Modal`.
   * @param modalElement - Элемент модального окна.
   * @param emitter - Экземпляр `EventEmitter` для управления событиями.
   */
  constructor(modalElement: HTMLElement, emitter: EventEmitter) {
    this.modalElement = modalElement;
    this.emitter = emitter;

    // Обработчик для кнопки закрытия модального окна
    const closeButton = this.modalElement.querySelector('.modal__close') as HTMLElement;
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    // Обработчик для закрытия модального окна при клике на оверлей
    this.modalElement.addEventListener('click', (event) => {
      if (event.target === this.modalElement) {
        this.close();
      }
    });

    // Слушаем событие закрытия модального окна из других частей приложения
    this.emitter.on('closeModal', () => {
      this.close();
    });
  }

  /**
   * Открывает модальное окно.
   */
  open(): void {
    this.modalElement.classList.add('modal_active');
    document.body.classList.add('modal-open');
  }

  /**
   * Закрывает модальное окно.
   */
  close(): void {
    this.modalElement.classList.remove('modal_active');
    document.body.classList.remove('modal-open');
    this.contentType = null;
  }

  /**
   * Устанавливает содержимое модального окна.
   * @param content - Элемент содержимого.
   * @param contentType - Тип содержимого (опционально).
   */
  setContent(content: HTMLElement, contentType?: string): void {
    const contentContainer = this.modalElement.querySelector('.modal__content');
    if (contentContainer) {
      contentContainer.innerHTML = '';
      contentContainer.appendChild(content);
    }
    if (contentType) {
      this.contentType = contentType;
    }
  }

  /**
   * Проверяет, открыто ли модальное окно.
   * @returns true, если модальное окно открыто; иначе false.
   */
  isOpen(): boolean {
    return this.modalElement.classList.contains('modal_active');
  }

  /**
   * Возвращает тип содержимого модального окна.
   * @returns Строка с типом содержимого или null.
   */
  getContentType(): string | null {
    return this.contentType;
  }
}
