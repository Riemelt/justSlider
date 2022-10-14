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
  }: Options) {

    this.options = { from, to, isRange, min, max, step, orientation };

    [this.options.min, this.options.max] = this.validateMinMax(min, max);
    this.options.step                    = this.validateStep(step, this.options.max - this.options.min);

    this.options.from                    = this.validateHandle(from, "from");
    this.options.from                    = this.adjustHandle(this.options.from, step);
    this.options.to                      = this.validateHandle(to, "to");
    this.options.to                      = this.adjustHandle(this.options.to, step);
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

    this.eventManager.dispatchEvent("HandleMove");
  }

  private adjustHandle(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  private validateHandle(value: number, type: HandleType): number {
    const { to, max, min, from, isRange } = this.options;

    if (value > max) {
      value = max;
    }

    if (value < min) {
      value = min;
    }

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