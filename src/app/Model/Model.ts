import EventManager from "../EventManager/EventManager";

class Model {
  private options: Options;
  private eventManager: EventManager;

  constructor() {
    console.log("Model created");
  }

  init(options: Options) {
    this.options = options;
    return options;
  }

  setEventManager(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  getOptions(): Options {
    return this.options;
  }

  setHandle(value: number, handle: HandleType) {
    const { step } = this.options;
    const previousValue = this.options[handle];

    const validatedValue = this.validateHandle(value, handle);

    const sign = validatedValue > previousValue ? 1 : -1;
    const difference = Math.abs(validatedValue - previousValue);
    const stepsMade = this.adjustHandle(difference);

    const move = stepsMade * step * sign;
    this.options[handle] += move;

    this.eventManager.dispatchEvent("HandleMove");
  }

  adjustHandle(value: number): number {
    const { step } = this.options;
    const adjustedValue = Math.floor(value / step);
    return adjustedValue;
  }

  validateHandle(value: number, handle: HandleType): number {
    const { to, max, min, from } = this.options;

    if (value > max) {
      value = max;
    }

    if (value < min) {
      value = min;
    }

    if (handle === "from") {
      value = value > to ? to : value;
    } else {
      value = value < from ? from : value;
    }

    return value;
  }

}

export default Model;