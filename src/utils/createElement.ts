// src/utils/createElement.ts

/**
 * Функция для создания DOM-элемента с заданными свойствами.
 * @param tagName - Имя тега элемента.
 * @param props - Объект со свойствами и атрибутами элемента.
 * @returns Созданный DOM-элемент.
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: { [key: string]: any } = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  Object.entries(props).forEach(([key, value]) => {
    if (key in element) {
      (element as any)[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
}
