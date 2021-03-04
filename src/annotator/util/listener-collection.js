/**
 * @typedef Listener
 * @prop {Window|Element|Document} eventTarget
 * @prop {string} eventType
 * @prop {(event: Event) => void} listener
 */

/**
 * Utility that prevents forgetting to remove event listener.
 */
export class ListenerCollection {
  constructor() {
    /** @type{Listener[]} */
    this.listeners = [];
  }

  /**
   * @param {Listener['eventTarget']} eventTarget
   * @param {Listener['eventType']} eventType
   * @param {Listener['listener']} listener
   * @param {boolean | AddEventListenerOptions | undefined} [options]
   */
  add(eventTarget, eventType, listener, options) {
    eventTarget.addEventListener(eventType, listener, options);
    this.listeners.push({ eventTarget, eventType, listener });
  }

  removeAll() {
    this.listeners.forEach(({ eventTarget, eventType, listener }) => {
      eventTarget.removeEventListener(eventType, listener);
    });
    this.listeners = [];
  }
}
