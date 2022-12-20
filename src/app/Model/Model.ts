import {
  DIRECTION_UPDATE,
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  MIN_MAX_UPDATE,
  ORIENTATION_UPDATE,
  PRECISION_UPDATE,
  PROGRESS_BAR_UPDATE,
  RANGE_UPDATE,
  SCALE_UPDATE,
  STEP_UPDATE,
  TOOLTIPS_UPDATE,
} from '../EventManager/constants';
import EventManager from '../EventManager/EventManager';
import {
  Direction,
  Options,
  Orientation,
  State,
} from '../types';
import {
  LINE,
  NUMBER,
  STEPS,
} from '../View/Scale/constants';
import {
  ScaleOptions,
  Segment,
} from '../View/Scale/types';
import {
  FORWARD,
  FROM,
  HORIZONTAL,
  TO,
} from './constants';
import {
  HandleType,
} from './types';
import {
  getUpdates,
  UPDATES,
} from './updates';

class Model {
  private eventManager: EventManager;
  private state: State;

  private readonly DEFAULT_STATE: State = {
    from: 0,
    to: 100,
    min: 0,
    max: 100,
    step: 10,
    orientation: HORIZONTAL,
    direction: FORWARD,
    range: false,
    tooltips: false,
    progressBar: false,
    scale: null,
    precision: 0,
  };

  static adjustFloat(value: number, precision: number): number {
    const decimals = 10 ** precision;
    return Math.round(value * decimals) / decimals;
  }

  static getNumberOfDecimals(value: number): number {
    const convertedToString = value.toString();
    const hasDecimals = convertedToString.includes('.');

    if (!hasDecimals) {
      return 0;
    }

    return convertedToString.split('.').pop()?.length ?? 0;
  }

  static validateHandleOnMinMax(
    value: number,
    min: number,
    max: number
  ): number {
    if (value > max) {
      return max;
    }

    if (value < min) {
      return min;
    }

    return value;
  }

  static validateHandleOnCollision(
    value: number,
    type: HandleType,
    from: number,
    to: number,
    range: boolean
  ): number {
    if (!range) {
      return value;
    }

    if (type === FROM) {
      return value > to ? to : value;
    }

    return value < from ? from : value;
  }

  static validatePrecision(precision: number): number {
    return (precision <= 0) ? 0 : precision;
  }

  static validateScaleSet(set: Array<number>): Array<number> {
    const validated = set.filter((value) => value >= 0 && value <= 100);
    return validated;
  }

  static validateScaleDensity(density: number): number {
    if (density < 0) {
      return 0;
    }

    if (density > 100) {
      return 100;
    }

    return density;
  }

  static validateStep(step: number, length: number): number {
    const newStep = step > length ? length : step;

    if (newStep <= 0) {
      return 1;
    }

    return newStep;
  }

  static validateMinMax(min: number, max: number): [number, number] {
    return min > max ? [max, min] : [min, max];
  }

  static getValueFromPercentage(
    percentage: number,
    min: number,
    max: number
  ): number {
    return min + ((max - min) * percentage / 100);
  }

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    this.state = this.DEFAULT_STATE;
  }

  public init({
    from = this.DEFAULT_STATE.from,
    to = this.DEFAULT_STATE.to,
    min = this.DEFAULT_STATE.min,
    max = this.DEFAULT_STATE.max,
    step = this.DEFAULT_STATE.step,
    orientation = this.DEFAULT_STATE.orientation,
    direction = this.DEFAULT_STATE.direction,
    range = this.DEFAULT_STATE.range,
    tooltips = this.DEFAULT_STATE.tooltips,
    progressBar = this.DEFAULT_STATE.progressBar,
    scale = this.DEFAULT_STATE.scale,
    precision = this.DEFAULT_STATE.precision,
  }: Options = {}): void {
    this.state = {
      from,
      to,
      min,
      max,
      step,
      orientation,
      direction,
      range,
      tooltips,
      progressBar,
      precision,
      scale: null,
    };

    this.setMinMax(min, max);
    this.setStep(step);
    this.setHandle(FROM, from);
    this.setHandle(TO, to);
    this.setScale(scale);
  }

  public getState(): State {
    return this.state;
  }

  public updateOptions(options: Options): void {
    const {
      from,
      to,
      min,
      max,
      step,
      orientation,
      direction,
      range,
      tooltips,
      progressBar,
      scale,
      precision,
    } = options;

    const { events, stateUpdates } = getUpdates(options);

    stateUpdates.forEach((update) => {
      switch (update) {
        case MIN_MAX_UPDATE:
          this.setMinMax(min, max);
          break;
        case STEP_UPDATE:
          this.setStep(step);
          break;
        case RANGE_UPDATE:
          this.setRange(range);
          break;
        case DIRECTION_UPDATE:
          this.setDirection(direction);
          break;
        case ORIENTATION_UPDATE:
          this.setOrientation(orientation);
          break;
        case PROGRESS_BAR_UPDATE:
          this.setProgressBar(progressBar);
          break;
        case TOOLTIPS_UPDATE:
          this.setTooltips(tooltips);
          break;
        case HANDLE_TO_MOVE:
          this.setHandle(TO, to);
          break;
        case HANDLE_FROM_MOVE:
          this.setHandle(FROM, from);
          break;
        case SCALE_UPDATE:
          this.setScale(scale);
          break;
        case PRECISION_UPDATE:
          this.setPrecision(precision);
          break;
        default:
          break;
      }
    });

    this.eventManager.dispatchEvents(events);
  }

  public updateHandle(
    value: number,
    type: HandleType,
    shouldAdjust = true
  ): void {
    this.setHandle(type, value, shouldAdjust);

    const event = type === FROM ? HANDLE_FROM_MOVE : HANDLE_TO_MOVE;
    const { events } = UPDATES[event];

    this.eventManager.dispatchEvents(events);
  }

  private setHandle(
    type: HandleType,
    value?: number,
    shouldAdjust = true
  ): void {
    const newValue = value ?? this.state[type];
    const { step } = this.state;

    let adjusted: number;
    let precision: number;

    if (shouldAdjust) {
      adjusted = this.adjustHandle(newValue, step, type);
      precision = Model.getNumberOfDecimals(step);
    } else {
      adjusted = newValue;
      precision = Model.getNumberOfDecimals(newValue);
    }

    const validated = this.validateHandle(newValue, type);
    const valueToSet = newValue !== validated ? validated : adjusted;

    this.state[type] = Model.adjustFloat(valueToSet, precision);
  }

  private adjustHandle(value: number, step: number, type: HandleType): number {
    const adjusted = this.adjustWithStep(value, step);
    const validated = this.validateHandle(adjusted, type);
    return validated;
  }

  private adjustWithStep(value: number, step: number): number {
    const { min } = this.state;
    const relativeValue = value + (min * (-1));

    const adjusted = (Math.round(relativeValue / step) * step) + min;
    return adjusted;
  }

  private validateHandle(value: number, type: HandleType): number {
    const { from, to, min, max, range } = this.state;

    const validatedOnCollision = Model.validateHandleOnCollision(
      value,
      type,
      from,
      to,
      range
    );

    const validatedOnMinMax = Model.validateHandleOnMinMax(
      validatedOnCollision,
      min,
      max
    );

    return validatedOnMinMax;
  }

  private setPrecision(precision?: number): void {
    const newValue = precision ?? this.state.precision;

    this.state.precision = Model.validatePrecision(newValue);
  }

  private setRange(range?: boolean): void {
    if (range === undefined) return;

    this.state.range = range;
  }

  private setDirection(direction?: Direction): void {
    if (direction === undefined) return;

    this.state.direction = direction;
  }

  private setOrientation(orientation?: Orientation): void {
    if (orientation === undefined) return;

    this.state.orientation = orientation;
  }

  private setProgressBar(progressBar?: boolean): void {
    if (progressBar === undefined) return;

    this.state.progressBar = progressBar;
  }

  private setTooltips(tooltips?: boolean): void {
    if (tooltips === undefined) return;

    this.state.tooltips = tooltips;
  }

  private setScale(scale?: ScaleOptions | null): void {
    const newScale = scale !== undefined ? scale : this.state.scale;

    if (newScale === null) {
      this.state.scale = null;
      return;
    }

    const currentScale = this.state.scale;

    const {
      type = currentScale?.type ?? STEPS,
      set = currentScale?.set ?? [0, 25, 50, 75, 100],
      density = currentScale?.density ?? 3,
      lines = currentScale?.lines ?? true,
      numbers = currentScale?.numbers ?? true,
    } = newScale;

    this.state.scale = {
      set,
      type,
      lines,
      numbers,
      density,
      segments: [],
    };

    this.setScaleDensity(density);
    this.setScaleSet(set);

    if (type === STEPS) {
      this.generateScaleSegmentsStepsMode();
      return;
    }

    this.generateScaleSegmentsSetMode();
  }

  private generateScaleSegmentsStepsMode(): void {
    if (this.state.scale === null) return;

    const { density } = this.state.scale;
    const { min, max, step } = this.state;

    const lineStep = (max - min) * density / 100;
    const stepPrecision = Model.getNumberOfDecimals(step);

    for (
      let value = min;
      value < max;
      value = Model.adjustFloat(value + step, stepPrecision)
    ) {
      const numberSegment: Segment = {
        value,
        type: NUMBER,
      };

      this.state.scale.segments.push(numberSegment);

      let nextValue = value + step;
      nextValue = nextValue >= max ? max : nextValue;
      const distanceToNextValue = Model.adjustFloat(
        nextValue - value,
        stepPrecision
      );

      let linesPerStep: number;
      if (lineStep === 0) {
        linesPerStep = 0;
      } else {
        linesPerStep = Math.trunc(distanceToNextValue / lineStep);
        linesPerStep += distanceToNextValue % lineStep === 0 ? -1 : 0;
      }

      const lineDistance = distanceToNextValue / (linesPerStep + 1);

      for (let j = 0; j < linesPerStep; j += 1) {
        const lineSegment: Segment = {
          value: value + ((j + 1) * lineDistance),
          type: LINE,
        };

        this.state.scale.segments.push(lineSegment);
      }
    }

    this.state.scale.segments.push({
      value: max,
      type: NUMBER,
    });
  }

  private generateScaleSegmentsSetMode(): void {
    if (this.state.scale === null) return;

    const { density, set } = this.state.scale;
    const { min, max } = this.state;

    for (let i = 0; i < set.length - 1; i += 1) {
      const value = Model.getValueFromPercentage(set[i], min, max);

      const numberSegment: Segment = {
        value,
        type: NUMBER,
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

      for (let j = 0; j < linesPerStep; j += 1) {
        const linePercentage = set[i] + ((j + 1) * lineDistance);
        const lineSegment: Segment = {
          value: Model.getValueFromPercentage(linePercentage, min, max),
          type: LINE,
        };

        this.state.scale.segments.push(lineSegment);
      }
    }

    this.state.scale.segments.push({
      value: max,
      type: NUMBER,
    });
  }

  private setScaleSet(set: Array<number>): void {
    if (this.state.scale === null) return;

    const validated = Model.validateScaleSet(set);

    validated.sort((a, b) => a - b);
    validated.push(100);
    validated.unshift(0);

    const unique = Array.from(new Set(validated));

    this.state.scale.set = unique;
  }

  private setScaleDensity(density: number): void {
    if (this.state.scale === null) return;

    const validated = Model.validateScaleDensity(density);
    this.state.scale.density = validated;
  }

  private setMinMax(min?: number, max?: number): void {
    const newMin = min ?? this.state.min;
    const newMax = max ?? this.state.max;

    [this.state.min, this.state.max] = Model.validateMinMax(newMin, newMax);
  }

  private setStep(step?: number): void {
    const newStep = step ?? this.state.step;
    const { min, max } = this.state;

    this.state.step = Model.validateStep(newStep, max - min);
  }
}

export default Model;
