import EventManager from "../EventManager/EventManager";
import { Options } from "../types";

class Model {
  private eventManager: EventManager;
  private options: Options;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
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
    this.setHandle(from, "from");
    this.setHandle(to, "to");
  }

  public updateOptions({ from, to, min, max, step, orientation, direction, range, tooltips, progressBar }: Options) {
    const handlesToUpdate:  Set<HandleType>  = new Set();
    const eventsToDispatch: Set<SliderEvent> = new Set();

    if (min !== undefined || max !== undefined) {
      this.setMinMax(min, max);
      this.setStep(this.options.step);
      addHandlesToUpdate(["from", "to"]);
      addEventsToDispatch(["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"]);
    }

    if (step !== undefined) {
      this.setStep(step);
      addHandlesToUpdate(["from", "to"]);
      addEventsToDispatch(["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"]);
    }

    if (range !== undefined) {
      this.options.range = range;
      addHandlesToUpdate(["to"]);
      addEventsToDispatch(["HandleToMove", "ProgressBarUpdate", "SliderUpdate"]);
    }

    if (direction !== undefined) {
      this.options.direction = direction;
      addEventsToDispatch(["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"]);
    }

    if (orientation !== undefined) {
      this.options.orientation = orientation;
      addEventsToDispatch(["OrientationUpdate", "HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"]);
    }

    if (progressBar !== undefined) {
      this.options.progressBar = progressBar;
      addEventsToDispatch(["ProgressBarUpdate", "SliderUpdate"]);
    }

    if (tooltips !== undefined) {
      this.options.tooltips = tooltips;
      addEventsToDispatch(["TooltipsUpdate", "SliderUpdate"]);
    }

    if (from !== undefined) {
      addHandlesToUpdate(["from"]);
      addEventsToDispatch(["HandleFromMove", "ProgressBarUpdate", "SliderUpdate"]);
    }

    if (to !== undefined) {
      addHandlesToUpdate(["to"]);
      addEventsToDispatch(["HandleToMove", "ProgressBarUpdate", "SliderUpdate"]);
    }

    handlesToUpdate.forEach(type => {
      let value: number;
      if (type === "from") {
        value = from !== undefined ? from : this.options.from;
      } else {
        value = to !== undefined ? to : this.options.to;
      }

      this.setHandle(value, type);
    });

    this.eventManager.dispatchEvents(Array.from(eventsToDispatch));

    function addHandlesToUpdate(types: HandleType[]) {
      types.forEach(type => handlesToUpdate.add(type));
    }

    function addEventsToDispatch(events: SliderEvent[]) {
      events.forEach(event => eventsToDispatch.add(event));
    }
  }

  public getOptions(): Options {
    return this.options;
  }

  public updateHandle(value: number, type: HandleType) {
    this.setHandle(value, type);

    const event = type === "from" ? "HandleFromMove" : "HandleToMove";
    this.eventManager.dispatchEvents([event, "ProgressBarUpdate", "SliderUpdate"]);
  }

  private setHandle(value: number, type: HandleType) {
    const { step } = this.options;

    const newValue = this.adjustHandle(value, step, type);
    const validatedValue = this.validateHandle(value, type);
    this.options[type] = value !== validatedValue ? validatedValue : newValue;
  }

  private adjustHandle(value: number, step: number, type: HandleType): number {
    const { min } = this.options;
    const relativeValue = value + (min * (-1));

    const adjusted = (Math.round(relativeValue / step) * step) + min;
    const validated = this.validateHandle(adjusted, type);
    return validated;
  }

  private validateHandle(value: number, type: HandleType): number {
    const { to, max, min, from, range } = this.options;

    value = this.validateHandleOnCollision(value, type, from, to, range);
    value = this.validateHandleOnMinMax(value, min, max);

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
    const newStep = step > length ? length : step;
    
    if (newStep <= 0) {
      return 1;
    }
    
    return newStep;
  }

  private setStep(step: number) {
    this.options.step = this.validateStep(step, this.options.max - this.options.min);
  }
}

export default Model;