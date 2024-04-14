type AnyFunction<Type = any> = (...args: any[]) => Type;

type StringKeyOf<T> = Extract<keyof T, string>;

export type CallbackType<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>,
> = T[EventName] extends any[] ? T[EventName] : [T[EventName]];

export type CallbackFunction<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>,
> = (...props: CallbackType<T, EventName>) => any;

export class EventEmitter<T extends Record<string, any>> {
  private _callbacks: { [key: string]: AnyFunction[] } = {};

  off<EventName extends StringKeyOf<T>>(
    event: EventName,
    fn?: CallbackFunction<T, EventName>,
  ): this {
    const callbacks = this._callbacks[event];
    if (callbacks) {
      if (fn) {
        this._callbacks[event] = callbacks.filter(
          (callback) => callback !== fn,
        );
      } else {
        delete this._callbacks[event];
      }
    }
    return this;
  }

  on<EventName extends StringKeyOf<T>>(
    event: EventName,
    fn: CallbackFunction<T, EventName>,
  ): this {
    if (!this._callbacks[event]) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(fn);
    return this;
  }

  removeAllListeners(): void {
    this._callbacks = {};
  }

  emit<EventName extends StringKeyOf<T>>(
    event: EventName,
    ...args: CallbackType<T, EventName>
  ): this {
    const callbacks = this._callbacks[event];

    if (callbacks) {
      callbacks.forEach((callback) => callback.apply(this, args));
    }

    return this;
  }
}

export const event = new EventEmitter();
