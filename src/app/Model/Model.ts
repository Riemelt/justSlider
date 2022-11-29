import EventManager from "../EventManager/EventManager";
import { SliderEvent } from "../EventManager/types";
import {
  Direction,
  Options,
  Orientation,
  State,
} from "../types";
import {
  ScaleOptions,
  Segment,
} from "../View/Scale/types";
import {
  HandleType,
  Update,
} from "./types";

class Model {
  private eventManager: EventManager;
  private state: State;

  static adjustFloat(value: number, precision: number): number {
    const decimals = 10 ** precision;
    return Math.round(value * decimals) / decimals;
  }

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    this.state = {};
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
    scale       = null,
    precision   = 0,
  }: Options = {}) {

    this.state = { from, to, range, min, max, step, orientation, direction, tooltips, progressBar, precision };

    this.setMinMax(min, max);
    this.setStep(step);
    this.setHandle("from", from);
    this.setHandle("to", to);
    this.setScale(scale);
  }

  public getState(): State {
    return this.state;
  }

  public updateOptions({ from, to, min, max, step, orientation, direction, range, tooltips, progressBar, scale, precision }: Options) {
    const handlesToUpdate:  Set<HandleType>  = new Set();
    const eventsToDispatch: Set<SliderEvent> = new Set();
    let shouldUpdateScale = false;

    const updates: Array<Update | null> = [
      this.getMinMaxUpdate(min, max),
      this.getStepUpdate(step),
      this.getRangeUpdate(range),
      this.getDirectionUpdate(direction),
      this.getOrientationUpdate(orientation),
      this.getProgressBarUpdate(progressBar),
      this.getTooltipsUpdate(tooltips),
      this.getHandleUpdate("to", to),
      this.getHandleUpdate("from", from),
      this.getScaleUpdate(scale),
      this.getPrecisionUpdate(precision),
    ];

    updates.forEach(update => {
      if (update === null) return;

      const { events, handles, scale } = update;
      events.forEach(event => eventsToDispatch.add(event));
      handles.forEach(handle => handlesToUpdate.add(handle));
      
      if (scale) {
        shouldUpdateScale = true;
      }
    });

    handlesToUpdate.forEach(type => {
      let value: number | undefined;

      if (type === "from") {
        value = from !== undefined ? from : this.state.from;
      } else {
        value = to !== undefined ? to : this.state.to;
      }

      this.setHandle(type, value);
    });

    if (shouldUpdateScale) {
      const scaleOptions = scale === undefined ? this.state.scale : scale;
      this.setScale(scaleOptions);
    }

    this.eventManager.dispatchEvents(Array.from(eventsToDispatch));
  }

  public updateHandle(value: number, type: HandleType) {
    this.setHandle(type, value);

    const update = this.getHandleUpdate(type, value);

    if (update !== null) {
      this.eventManager.dispatchEvents(update.events);
    }
  }

  private getHandleUpdate(type: HandleType, value?: number, ): Update | null {
    if (value === undefined) return null;

    const event = type === "from" ? "HandleFromMove" : "HandleToMove";
    return {
      events:  [event, "ProgressBarUpdate", "SliderUpdate"],
      handles: [type],
      scale:   false,
    }
  }

  private setHandle(type: HandleType, value?: number) {
    const {
      step      = 1,
      precision = 0,
    } = this.state;

    const newValue       = this.adjustHandle(value, step, type);
    const validatedValue = this.validateHandle(value, type);
    const valueToSet     = value !== validatedValue ? validatedValue : newValue;
    
    this.state[type] = Model.adjustFloat(valueToSet, precision);
  }

  private adjustHandle(value = 0, step: number, type: HandleType): number {
    const { min = 0 } = this.state;
    const relativeValue = value + (min * (-1));

    const adjusted = (Math.round(relativeValue / step) * step) + min;
    const validated = this.validateHandle(adjusted, type);
    return validated;
  }

  private validateHandle(value = 0, type: HandleType): number {
    const {
      to    = 0,
      max   = 0,
      min   = 0,
      from  = 0,
      range = false,
    } = this.state;

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

  private getPrecisionUpdate(precision?: number): Update | null {
    if (precision === undefined) return null;
    this.setPrecision(precision);

    return {
      events:  ["TooltipsUpdate", "ScaleUpdate", "SliderUpdate"],
      handles: [],
      scale:   true,
    };
  }

  private setPrecision(precision: number) {
    this.state.precision = this.validatePrecision(precision);
  }

  private validatePrecision(precision: number): number {
    return (precision <= 0) ? 0 : precision;
  }

  private getTooltipsUpdate(tooltips?: boolean): Update | null {
    if (tooltips === undefined) return null;
    this.state.tooltips = tooltips;

    return {
      events:  ["TooltipsUpdate", "SliderUpdate"],
      handles: [],
      scale:   false,
    };
  }

  private getProgressBarUpdate(progressBar?: boolean): Update | null {
    if (progressBar === undefined) return null;
    this.state.progressBar = progressBar;

    return {
      events:  ["ProgressBarUpdate", "SliderUpdate"],
      handles: [],
      scale:   false,
    };
  }

  private getDirectionUpdate(direction?: Direction): Update | null {
    if (direction === undefined) return null;
    this.state.direction = direction;

    return {
      events:  ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "ScaleUpdate", "SliderUpdate"],
      handles: [],
      scale:   false,
    };
  }

  private getOrientationUpdate(orientation?: Orientation): Update | null {
    if (orientation === undefined) return null;
    this.state.orientation = orientation;

    return {
      events:  ["OrientationUpdate", "HandleFromMove", "HandleToMove", "ProgressBarUpdate", "ScaleUpdate", "SliderUpdate"],
      handles: [],
      scale:   false,
    };
  }

  private getRangeUpdate(range?: boolean): Update | null {
    if (range === undefined) return null;
    this.state.range = range;

    return {
      events:  ["HandleToMove", "ProgressBarUpdate", "SliderUpdate"],
      handles: ["to"],
      scale:   false,
    };
  }

  private getScaleUpdate(scale?: ScaleOptions | null): Update | null {
    if (scale === undefined) return null;

    return {
      events:  ["ScaleUpdate", "SliderUpdate"],
      handles: [],
      scale:   true,
    };
  }

  private setScale(scale: ScaleOptions | null = null) {
    if (scale === null) {
      this.state.scale = null;
      return;
    }

    const currentScale = this.state.scale;

    const {
      type    = currentScale?.type ? currentScale.type : "steps",
      set     = currentScale?.set ? currentScale.set : [0, 25, 50, 75, 100],
      density = currentScale?.density ? currentScale.density : 3,
      lines   = currentScale?.lines ? currentScale.lines : true,
      numbers = currentScale?.numbers ? currentScale.numbers : true,
    } = scale;

    this.state.scale = {
      set,
      type,
      lines,
      numbers,
      segments: [],
    }

    this.setScaleDensity(density);
    this.setScaleSet(set);
    const generateScaleSegments = (type === "steps") ? this.generateScaleSegmentsStepsMode.bind(this) : this.generateScaleSegmentsSetMode.bind(this);
    generateScaleSegments();
  }

  private generateScaleSegmentsStepsMode() {
    if (this.state.scale === undefined || this.state.scale === null) return;

    const { density = 1 } = this.state.scale;
    const {
      min       = 0,
      max       = 0,
      step      = 1,
      precision = 0,
    } = this.state;

    const lineStep = (max - min) * density / 100;

    for (let value = min; value < max; value = Model.adjustFloat(value + step, precision)) {
      const numberSegment: Segment = {
        value,
        type: "number",
      };

      this.state.scale.segments.push(numberSegment);

      let nextValue             = Model.adjustFloat(value + step, precision);
      nextValue                 = nextValue >= max ? max : nextValue;
      const distanceToNextValue = nextValue - value;

      let linesPerStep: number;
      if (lineStep === 0) {
        linesPerStep = 0;
      } else {
        linesPerStep = Math.trunc(distanceToNextValue / lineStep);
        linesPerStep += distanceToNextValue % lineStep === 0 ? -1 : 0;
      }

      const lineDistance = distanceToNextValue / (linesPerStep + 1);

      for (let j = 0; j < linesPerStep; j++) {
        const lineSegment: Segment = {
          value: value + ((j + 1) * lineDistance),
          type: "line",
        };

        this.state.scale.segments.push(lineSegment);
      }
    }

    this.state.scale.segments.push({
      value: max,
      type: "number",
    });
  }
  
  private generateScaleSegmentsSetMode() {
    if (this.state.scale === undefined || this.state.scale === null) return;

    const {
      density = 1,
      set     = [],
    } = this.state.scale;
    const {
      min = 0,
      max = 0,
    } = this.state;

    for (let i = 0; i < set.length - 1; i++) {
      const value = this.getValueFromPercentage(set[i], min, max);

      const numberSegment: Segment = {
        value,
        type: "number",
      };

      this.state.scale.segments.push(numberSegment);

      const distanceToNextValue = set[i + 1] - set[i];

      let linesPerStep: number;
      if (density === 0) {
        linesPerStep = 0;
      } else {
        linesPerStep = Math.trunc(distanceToNextValue / density);
        linesPerStep += distanceToNextValue % density === 0 ? -1 : 0;
      }

      const lineDistance = distanceToNextValue / (linesPerStep + 1);

      for (let j = 0; j < linesPerStep; j++) {
        const linePercentage = set[i] + ((j + 1) * lineDistance);
        const lineSegment: Segment = {
          value: this.getValueFromPercentage(linePercentage, min, max),
          type: "line",
        };

        this.state.scale.segments.push(lineSegment);
      }
    }

    this.state.scale.segments.push({
      value: max,
      type: "number",
    });
  }

  private getValueFromPercentage(percentage: number, min: number, max: number): number {
    return min + ((max - min) * percentage / 100);
  }

  private setScaleSet(set: Array<number>) {
    if (this.state.scale === undefined || this.state.scale === null) return;

    const validated = this.validateScaleSet(set);

    validated.sort((a, b) => a - b);
    validated.push(100);
    validated.unshift(0);

    const unique = Array.from(new Set(validated));

    this.state.scale.set = unique;
  }

  private validateScaleSet(set: Array<number>) {
    const validated = set.filter(value => value >= 0 && value <= 100);
    return validated;
  }

  private setScaleDensity(density: number) {
    if (this.state.scale === undefined || this.state.scale === null) return;
    
    const validated = this.validateScaleDensity(density);

    this.state.scale.density = validated;
  }

  private validateScaleDensity(density: number): number {
    if (density < 0) {
      return 0;
    }

    if (density > 100) {
      return 100;
    }

    return density;
  }

  private getMinMaxUpdate(min?: number, max?: number): Update | null {
    if (min === undefined && max === undefined) return null;

    this.setMinMax(min, max);
    const { step = 1 } = this.state;
    this.setStep(step);

    return {
      events:  ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "ScaleUpdate", "SliderUpdate"],
      handles: ["from", "to"],
      scale:   true,
    };
  }

  private validateMinMax(min = 0, max = 0): [number, number] {
    return [min, max] = min > max ? [max, min] : [min, max];
  }

  private setMinMax(min?: number, max?: number) {
    const newMin = min !== undefined ? min : this.state.min;
    const newMax = max !== undefined ? max : this.state.max;

    [this.state.min, this.state.max] = this.validateMinMax(newMin, newMax);
  }

  private getStepUpdate(step?: number): Update | null {
    if (step === undefined) return null;
    this.setStep(step);

    return {
      events:  ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "ScaleUpdate", "SliderUpdate"],
      handles: ["from", "to"],
      scale:   true,
    };
  }

  private validateStep(step: number, length: number) {
    const newStep = step > length ? length : step;
    
    if (newStep <= 0) {
      return 1;
    }
    
    return newStep;
  }

  private setStep(step: number) {
    const {
      min = 0,
      max = 0,
    } = this.state;
    
    this.state.step = this.validateStep(step, max - min);
  }
}

export default Model;