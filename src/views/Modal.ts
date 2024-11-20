// Файл: /src/views/Modal.ts

/**
 * Модуль предоставляет класс `Modal` для управления модальным окном.
 */

import { EventEmitter } from '../components/base/events';

/**
 * Класс `Modal` отвечает за открытие, закрытие и управление содержимым модального окна.
 */
export class Modal {
  private modalElement: HTMLElement;
  private closeButton: HTMLElement | null;
  private contentContainer: HTMLElement | null;
  private emitter: EventEmitter;
  private contentType: string | null = null;

  /**
   * Создает экземпляр класса `Modal`.
   * @param modalElement - Элемент модального окна.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(modalElement: HTMLElement, emitter: EventEmitter) {
    this.modalElement = modalElement;
    this.emitter = emitter;

    // Сохраняем ссылки на элементы
    this.closeButton = this.modalElement.querySelector('.modal__close');
    this.contentContainer = this.modalElement.querySelector('.modal__content');

    // Навешиваем обработчики событий
    this.initEventListeners();
  }

  /**
   * Инициализирует обработчики событий для модального окна.
   */
  private initEventListeners(): void {
    // Обработчик кнопки закрытия
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    // Обработчик клика на фон модального окна
    this.modalElement.addEventListener('click', (event) => {
      if (event.target === this.modalElement) {
        this.close();
      }
    });

    // Обработчик закрытия по клавише ESC
    document.addEventListener('keydown', this.handleEscapeKey);

    this.emitter.on('closeModal', () => {
      this.close();
    });
  }

  /**
   * Обработчик клавиши ESC для закрытия модального окна.
   */
  private handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  };

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
    if (this.contentContainer) {
      this.contentContainer.innerHTML = '';
      this.contentContainer.appendChild(content);
    }
    if (contentType) {
      this.contentType = contentType;
    }
  }

  /**
   * Проверяет, открыто ли модальное окно.
   * @returns `true`, если модальное окно открыто.
   */
  isOpen(): boolean {
    return this.modalElement.classList.contains('modal_active');
  }

  /**
   * Возвращает тип текущего содержимого модального окна.
   * @returns Тип содержимого или `null`.
   */
  getContentType(): string | null {
    return this.contentType;
  }
}
