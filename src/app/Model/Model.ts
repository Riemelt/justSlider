import EventManager from "../EventManager/EventManager";
import { Options } from "../types";

class Model {
  private options: Options;
  private eventManager: EventManager;

  constructor() {
    //
  }

  public init({
    from        = 0,
    to          = 100,
    min         = 0,
    max         = 100,
    step        = 10,
    orientation = "horizontal",
    direction   = "forward",
    range       = false,
    tooltips    = false,
    progressBar = false,
  }: Options) {

    this.options = { from, to, range, min, max, step, orientation, direction, tooltips, progressBar };

    this.setMinMax(min, max);
    this.setStep(step);
    this.updateHandle(from, "from");
    this.updateHandle(to, "to");
  }

  public updateOptions({ from, to, min, max, step, orientation, direction, range, tooltips, progressBar }: Options) {
    const handlesToUpdate: Set<HandleType> = new Set();

    if (min !== undefined || max !== undefined) {
      this.setMinMax(min, max);
      addHandlesToUpdate(["from", "to"]);
    }

    if (step !== undefined) {
      this.setStep(step);
      addHandlesToUpdate(["from", "to"]);
    }

    if (range !== undefined) {
      this.options.range = range;
      addHandlesToUpdate(["to"]);
    }

    if (direction !== undefined) {
      this.options.direction = direction;
    }

    if (orientation !== undefined) {
      this.options.orientation = orientation;
    }

    if (progressBar !== undefined) {
      this.options.progressBar = progressBar;
    }

    if (tooltips !== undefined) {
      this.options.tooltips = tooltips;
    }

    if (from !== undefined) {
      addHandlesToUpdate(["from"]);
    }

    if (to !== undefined) {
      addHandlesToUpdate(["to"]);
    }

    handlesToUpdate.forEach(type => {
      let value: number;
      if (type === "from") {
        value = from !== undefined ? from : this.options.from;
      } else {
        value = to !== undefined ? to : this.options.to;
      }

      this.updateHandle(value, type);
    });

    this.eventManager.dispatchEvent("SliderUpdate");

    function addHandlesToUpdate(types: HandleType[]) {
      types.forEach(type => handlesToUpdate.add(type));
    }
  }

  public setEventManager(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  public getOptions(): Options {
    return this.options;
  }

  public setHandle(value: number, type: HandleType) {
    this.updateHandle(value, type);

    const event = type === "from" ? "HandleFromMove" : "HandleToMove";
    this.eventManager.dispatchEvent(event);
  }

  private updateHandle(value: number, type: HandleType) {
    const { step } = this.options;

    const newValue = this.adjustHandle(value, step);
    const validatedValue = this.validateHandle(value, type);
    this.options[type] = value !== validatedValue ? validatedValue : newValue;
  }

  private adjustHandle(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  private validateHandle(value: number, type: HandleType): number {
    const { to, max, min, from, range } = this.options;

    value = this.validateHandleOnMinMax(value, min, max);
    value = this.validateHandleOnCollision(value, type, from, to, range);

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

  private validateHandleOnCollision(value: number, type: HandleType, from: number, to: number, range: boolean): number {
    if (!range) {
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

  private setMinMax(min: number, max: number) {
    const newMin = min !== undefined ? min : this.options.min;
    const newMax = max !== undefined ? max : this.options.max;

    [this.options.min, this.options.max] = this.validateMinMax(newMin, newMax);
  }

  private validateStep(step: number, length: number) {
    return step > length ? length : step;
  }

  private setStep(step: number) {
    this.options.step = this.validateStep(step, this.options.max - this.options.min);
  }
}

export default Model;