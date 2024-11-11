// src/views/FormView.ts

import { EventEmitter } from '../utils/EventEmitter';
import { PaymentMethod } from '../types';

/**
 * Класс `FormView` отвечает за отображение и управление формами заказа.
 */
export class FormView {
  private emitter: EventEmitter;
  private orderTemplate: HTMLTemplateElement;
  private contactsTemplate: HTMLTemplateElement;
  private successTemplate: HTMLTemplateElement;
  private currentForm: HTMLFormElement | null = null;

  /**
   * Создает экземпляр `FormView`.
   * @param emitter - Экземпляр `EventEmitter` для управления событиями.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;

    // Получаем шаблоны форм из HTML
    const orderTemplateElement = document.getElementById('order') as HTMLTemplateElement;
    if (!orderTemplateElement) {
      throw new Error('Template #order not found');
    }
    this.orderTemplate = orderTemplateElement;

    const contactsTemplateElement = document.getElementById('contacts') as HTMLTemplateElement;
    if (!contactsTemplateElement) {
      throw new Error('Template #contacts not found');
    }
    this.contactsTemplate = contactsTemplateElement;

    const successTemplateElement = document.getElementById('success') as HTMLTemplateElement;
    if (!successTemplateElement) {
      throw new Error('Template #success not found');
    }
    this.successTemplate = successTemplateElement;
  }

  /**
   * Получает и настраивает форму заказа.
   * @returns Элемент формы заказа.
   */
  getOrderForm(): HTMLElement {
    const formElement = this.orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    this.currentForm = formElement;

    this.setupOrderForm();

    return formElement;
  }

  /**
   * Получает и настраивает форму контактов.
   * @returns Элемент формы контактов.
   */
  getContactsForm(): HTMLElement {
    const formElement = this.contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    this.currentForm = formElement;

    this.setupContactsForm();

    return formElement;
  }

  /**
   * Получает сообщение об успешном заказе.
   * @param total - Общая стоимость заказа.
   * @returns Элемент сообщения об успехе.
   */
  getSuccessMessage(total: number): HTMLElement {
    const successElement = this.successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const description = successElement.querySelector('.order-success__description') as HTMLElement;
    if (description) {
      description.textContent = `Списано ${total} синапсов`;
    }

    const closeButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.emitter.emit('closeModal');
      });
    }

    return successElement;
  }

  /**
   * Настраивает форму заказа.
   */
  private setupOrderForm(): void {
    if (!this.currentForm) return;

    const paymentButtons = this.currentForm.querySelectorAll('.order__buttons .button');
    paymentButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        paymentButtons.forEach((btn) => btn.classList.remove('button_selected'));
        button.classList.add('button_selected');
        this.validateOrderForm();
      });
    });

    const addressInput = this.currentForm.querySelector('input[name="address"]') as HTMLInputElement;
    addressInput.addEventListener('input', () => {
      this.validateOrderForm();
    });

    // Обработчики для полей ввода для управления прозрачностью формы
    const inputs = this.currentForm.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        const anyInputFilled = Array.from(inputs).some((inp) => (inp as HTMLInputElement).value.trim() !== '');
        this.setFormTransparency(anyInputFilled);
      });
    });

    const submitButton = this.currentForm.querySelector('.modal__actions .button') as HTMLButtonElement;
    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.validateOrderForm()) {
        const paymentText = this.currentForm?.querySelector('.button_selected')?.textContent || '';
        let paymentMethod: PaymentMethod;

        if (paymentText === 'Онлайн') {
          paymentMethod = 'online';
        } else if (paymentText === 'При получении') {
          paymentMethod = 'cash';
        } else {
          paymentMethod = 'cash';
        }

        const address = addressInput.value.trim();

        this.emitter.emit('orderStepCompleted', { payment: paymentMethod, address });
      }
    });
  }

  /**
   * Валидирует форму заказа.
   * @returns true, если форма валидна; иначе false.
   */
  private validateOrderForm(): boolean {
    if (!this.currentForm) return false;
    const paymentSelected = this.currentForm.querySelector('.button_selected');
    const addressInput = this.currentForm.querySelector('input[name="address"]') as HTMLInputElement;
    const submitButton = this.currentForm.querySelector('.modal__actions .button') as HTMLButtonElement;
    const errorsElement = this.currentForm.querySelector('.form__errors') as HTMLElement;

    let isValid = true;
    let errors = '';

    if (!paymentSelected) {
      isValid = false;
      errors += 'Выберите способ оплаты.<br>';
    }

    if (!addressInput.value.trim()) {
      isValid = false;
      errors += 'Введите адрес доставки.<br>';
    }

    submitButton.disabled = !isValid;
    if (errorsElement) {
      errorsElement.innerHTML = errors;
    }

    return isValid;
  }

  /**
   * Настраивает форму контактов.
   */
  private setupContactsForm(): void {
    if (!this.currentForm) return;

    const emailInput = this.currentForm.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = this.currentForm.querySelector('input[name="phone"]') as HTMLInputElement;

    emailInput.addEventListener('input', () => {
      this.validateContactsForm();
    });

    phoneInput.addEventListener('input', () => {
      this.validateContactsForm();
    });

    // Обработчики для полей ввода для управления прозрачностью формы
    const inputs = this.currentForm.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        const anyInputFilled = Array.from(inputs).some((inp) => (inp as HTMLInputElement).value.trim() !== '');
        this.setFormTransparency(anyInputFilled);
      });
    });

    const submitButton = this.currentForm.querySelector('.modal__actions .button') as HTMLButtonElement;
    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.validateContactsForm()) {
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        this.emitter.emit('formSubmitted', { email, phone });
      }
    });
  }

  /**
   * Валидирует форму контактов.
   * @returns true, если форма валидна; иначе false.
   */
  private validateContactsForm(): boolean {
    if (!this.currentForm) return false;
    const emailInput = this.currentForm.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = this.currentForm.querySelector('input[name="phone"]') as HTMLInputElement;
    const submitButton = this.currentForm.querySelector('.modal__actions .button') as HTMLButtonElement;
    const errorsElement = this.currentForm.querySelector('.form__errors') as HTMLElement;

    let isValid = true;
    let errors = '';

    if (!emailInput.value.trim()) {
      isValid = false;
      errors += 'Введите Email.<br>';
    }

    if (!phoneInput.value.trim()) {
      isValid = false;
      errors += 'Введите телефон.<br>';
    }

    submitButton.disabled = !isValid;
    if (errorsElement) {
      errorsElement.innerHTML = errors;
    }

    return isValid;
  }

  /**
   * Управляет прозрачностью формы.
   * @param isTransparent - true, если форма должна быть прозрачной; иначе false.
   */
  private setFormTransparency(isTransparent: boolean): void {
    if (!this.currentForm) return;

    if (isTransparent) {
      this.currentForm.classList.add('form_transparent');
    } else {
      this.currentForm.classList.remove('form_transparent');
    }
  }
}
