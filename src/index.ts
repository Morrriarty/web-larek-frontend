// src/index.ts

import './scss/styles.scss';
import { APIClientImpl } from './api/APIClient';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { ProductListView } from './views/ProductListView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { Modal } from './views/Modal';
import { FormView } from './views/FormView';
import { EventEmitter } from './utils/EventEmitter';
import { Product, Order, PaymentMethod } from './types';
import { API_URL } from './utils/constants';

// Инициализация

const apiClient = new APIClientImpl(API_URL);
const emitter = new EventEmitter();

// Модели
const productModel = new ProductModel(apiClient, emitter);
const cartModel = new CartModel(emitter);

// Отображения

const productContainer = document.querySelector('.gallery') as HTMLElement;
const productListView = new ProductListView(productContainer, emitter);

// Инициализация основного модального окна
const modalElement = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalElement, emitter);

const productDetailView = new ProductDetailView(emitter);
const formView = new FormView(emitter);

// Загрузка продуктов
productModel.fetchProducts();

// Обработчики событий

emitter.on('productsLoaded', (products: Product[]) => {
  productListView.render(products);

  // После загрузки продуктов инициализируем начальное модальное окно
  initializeInitialModal();
});

emitter.on('productSelected', (productId: string) => {
  const product = productModel.getProductById(productId);
  if (product) {
    const content = productDetailView.render(product);
    modal.setContent(content);
    modal.open();
  }
});

emitter.on('addToCart', (product: Product) => {
  cartModel.addItem(product);
  modal.close();
});

emitter.on('removeFromCart', (productId: string) => {
  cartModel.removeItem(productId);
});

emitter.on('cartUpdated', () => {
  const items = cartModel.getItems();
  const total = cartModel.getTotal();

  const cartCount = document.querySelector('.header__basket-counter') as HTMLElement;
  if (cartCount) {
    cartCount.textContent = items.length.toString();
  }

  // Обновляем содержимое корзины, если она открыта
  if (modal.isOpen() && modal.getContentType() === 'cart') {
    const cartView = new CartView(emitter);
    const cartContent = cartView.render(items, total);
    modal.setContent(cartContent, 'cart');
  }
});

// Обработчик для открытия корзины при нажатии на кнопку корзины
const basketButton = document.querySelector('.header__basket') as HTMLElement;
if (basketButton) {
  basketButton.addEventListener('click', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotal();
    const cartView = new CartView(emitter);
    const cartContent = cartView.render(items, total);
    modal.setContent(cartContent, 'cart');
    modal.open();
    emitter.emit('cartOpened');
  });
}

emitter.on('checkout', () => {
  // Используем форму из шаблона
  const formElement = formView.getOrderForm();
  modal.setContent(formElement, 'checkout');
  modal.open();
});

emitter.on('orderStepCompleted', (data: { payment: PaymentMethod; address: string }) => {
  // Сохраняем выбранный способ оплаты и адрес
  const { payment, address } = data;
  cartModel.setOrderDetails({ payment, address });

  // Используем форму из шаблона
  const contactsForm = formView.getContactsForm();
  modal.setContent(contactsForm, 'contacts');
});

emitter.on('formSubmitted', async (data: { email: string; phone: string }) => {
  // Получаем данные заказа из модели корзины
  const orderDetails = cartModel.getOrderDetails();
  const order: Order = {
    payment: orderDetails.payment,
    email: data.email,
    phone: data.phone,
    address: orderDetails.address,
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((item) => item.id),
  };
  try {
    await apiClient.createOrder(order);
    cartModel.clearCart();
    // Показываем сообщение об успешном заказе
    const successMessage = formView.getSuccessMessage(order.total);
    modal.setContent(successMessage, 'success');
    emitter.emit('cartUpdated');
  } catch (error) {
    alert(`Ошибка оформления заказа: ${(error as Error).message}`);
  }
});

/**
 * Инициализирует начальное модальное окно после загрузки продуктов.
 */
function initializeInitialModal() {
  const initialModal = document.querySelector('.modal.modal_active') as HTMLElement;

  if (initialModal) {
    const addToCartButton = initialModal.querySelector('.button') as HTMLButtonElement;

    if (addToCartButton) {
      addToCartButton.addEventListener('click', () => {
        const product = getProductDataFromInitialModal(initialModal);

        if (product) {
          cartModel.addItem(product);
          initialModal.classList.remove('modal_active');
          emitter.emit('cartUpdated');
        }
      });
    }
  }
}

/**
 * Получает данные продукта из начального модального окна.
 * @param modalElement - Элемент модального окна.
 * @returns Объект продукта или null, если не найден.
 */
function getProductDataFromInitialModal(modalElement: HTMLElement): Product | null {
  const titleElement = modalElement.querySelector('.card__title') as HTMLElement;
  const title = titleElement?.textContent?.trim() || '';

  if (title) {
    // Ищем товар по названию
    const product = productModel
      .getProducts()
      .find((p) => p.title.trim().toLowerCase() === title.trim().toLowerCase());
    if (product) {
      return product;
    } else {
      alert(`Товар с названием "${title}" не найден`);
      return null;
    }
  }

  return null;
}

// Обработчики для статических модальных окон
const modals = document.querySelectorAll('.modal');
modals.forEach((modalEl) => {
  const closeButton = modalEl.querySelector('.modal__close') as HTMLElement;
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modalEl.classList.remove('modal_active');
    });
  }

  // Закрытие модального окна при клике на оверлей
  modalEl.addEventListener('click', (event) => {
    if (event.target === modalEl) {
      modalEl.classList.remove('modal_active');
    }
  });
});
