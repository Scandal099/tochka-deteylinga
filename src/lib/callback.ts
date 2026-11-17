/** Opens the global "Заказать звонок" dialog (mounted once in CallbackModal). */
export const CALLBACK_EVENT = "open-callback";

export function openCallback(topic?: string) {
  window.dispatchEvent(new CustomEvent<string | undefined>(CALLBACK_EVENT, { detail: topic }));
}
