// src/utils/FormValidator.ts

/**
 * Класс `FormValidator` обеспечивает валидацию формы.
 */
export class FormValidator {
  private formElement: HTMLFormElement;

  /**
   * Создает экземпляр `FormValidator`.
   * @param formElement - Элемент формы для валидации.
   */
  constructor(formElement: HTMLFormElement) {
    this.formElement = formElement;
    this.attachEventListeners();
  }

  /**
   * Добавляет обработчики событий для формы.
   */
  private attachEventListeners(): void {
    this.formElement.addEventListener('input', () => this.validate());
  }

  /**
   * Валидирует форму.
   * @returns true, если форма валидна; иначе false.
   */
  validate(): boolean {
    let isValid = true;
    const inputs = this.formElement.querySelectorAll<HTMLInputElement>(
      'input[required], select[required]'
    );
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('input_error');
      } else {
        input.classList.remove('input_error');
      }
    });
    return isValid;
  }
}
