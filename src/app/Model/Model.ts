import EventManager from "../EventManager/EventManager";

class Model {
  private options: Options;
  private eventManager: EventManager;

  constructor() {
    console.log("Model created");
  }

  public init({
    from        = 0,
    to          = 100,
    isRange     = false,
    min         = 0,
    max         = 100,
    step        = 10,
    orientation = "horizontal",
    direction   = "forward",
  }: Options) {

    this.options = { from, to, isRange, min, max, step, orientation, direction };

    [this.options.min, this.options.max] = this.validateMinMax(min, max);
    this.options.step                    = this.validateStep(step, this.options.max - this.options.min);
    this.setHandle(from, "from");
    this.setHandle(to, "to");
  }

  public setEventManager(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  public getOptions(): Options {
    return this.options;
  }

  public setHandle(value: number, type: HandleType) {
    const { step } = this.options;

    const newValue = this.adjustHandle(value, step);
    const validatedValue = this.validateHandle(value, type);
    this.options[type] = value !== validatedValue ? validatedValue : newValue;

    const event = type === "from" ? "HandleFromMove" : "HandleToMove";
    this.eventManager.dispatchEvent(event);
  }

  private adjustHandle(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  private validateHandle(value: number, type: HandleType): number {
    const { to, max, min, from, isRange } = this.options;

    value = this.validateHandleOnMinMax(value, min, max);
    value = this.validateHandleOnCollision(value, type, from, to, isRange);

    return value;
  }

  private validateHandleOnMinMax(value: number, min: number, max: number): number {
    if (value > max) {
      value = max;
    }

    if (value < min) {
      value = min;
    }

    return value;
  }

  private validateHandleOnCollision(value: number, type: HandleType, from: number, to: number, isRange: boolean): number {
    if (!isRange) {
      return value;
    }

    if (type === "from") {
      value = value > to ? to : value;
    } else {
      value = value < from ? from : value;
    }

    return value;
  }

  private validateMinMax(min: number, max: number): [number, number] {
    return [min, max] = min > max ? [max, min] : [min, max];
  }

  private validateStep(step: number, length: number) {
    return step > length ? length : step;
  }
}

export default Model;