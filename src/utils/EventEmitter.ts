// src/utils/EventEmitter.ts

/**
 * Класс `EventEmitter` обеспечивает механизм подписки и уведомления слушателей о событиях.
 */
export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  /**
   * Подписывается на событие.
   * @param event - Имя события.
   * @param listener - Функция-обработчик события.
   */
  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  /**
   * Отписывается от события.
   * @param event - Имя события.
   * @param listener - Функция-обработчик, которую нужно удалить.
   */
  off(event: string, listener: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  /**
   * Вызывает событие и передает аргументы слушателям.
   * @param event - Имя события.
   * @param args - Аргументы для передачи слушателям.
   */
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }
}
