import { TinyEmitter as EventEmitter } from 'tiny-emitter';

// Adapted from:
//  https://github.com/openannotation/annotator/blob/v1.2.x/src/class.coffee
//
//  Annotator v1.2.10
//  https://github.com/openannotation/annotator
//
//  Copyright 2015, the Annotator project contributors.
//  Dual licensed under the MIT and GPLv3 licenses.
//  https://github.com/openannotation/annotator/blob/master/LICENSE

/**
 * Emitter is a pub/sub communication mechanism to send event among the
 * different elements of the application.
 */
export default class GuestEmitter {
  constructor() {
    if (!GuestEmitter.emitter) {
      GuestEmitter.emitter = new EventEmitter();
    }
    /** @type {EventEmitter} */
    this._emitter = GuestEmitter.emitter;

    /** @type {[event: string, callback: Function][]} */
    this._subscriptions = [];
  }

  /**
   * Clean up event listeners and other resources.
   *
   * Sub-classes should override this to clean up their resources and then call
   * the base implementation.
   */
  destroy() {
    for (let [event, callback] of this._subscriptions) {
      this._emitter.off(event, callback);
    }
    this._subscriptions = [];
  }

  /**
   * Fire an event.
   *
   * This and other `Delegator` instances which share the same root element will
   * be able to observe it.
   *
   * @param {string} event
   * @param {any[]} args
   */
  publish(event, ...args) {
    this._emitter.emit(event, ...args);
  }

  /**
   * Register an event handler.
   *
   * @param {string} event
   * @param {Function} callback
   */
  subscribe(event, callback) {
    this._emitter.on(event, callback);
    this._subscriptions.push([event, callback]);
  }

  /**
   * Remove an event handler.
   *
   * @param {string} event
   * @param {Function} callback
   */
  unsubscribe(event, callback) {
    this._emitter.off(event, callback);
    this._subscriptions = this._subscriptions.filter(
      ([subEvent, subCallback]) =>
        subEvent !== event || subCallback !== callback
    );
  }
}

GuestEmitter.emitter = undefined;
