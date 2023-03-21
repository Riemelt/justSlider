import {
  DIRECTION_UPDATE,
  HANDLES_SWAP,
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

  static readonly DEFAULT_STATE: State = {
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
    const match = (`${value}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

    if (!match) {
      return 0;
    }

    return Math.max(
      0,
      (match[1] ? match[1].length : 0)
      - (match[2] ? +match[2] : 0)
    );
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

  static areHandlesCollided(
    value: number,
    type: HandleType,
    from: number,
    to: number,
    range: boolean
  ): boolean {
    if (!range) {
      return false;
    }

    return type === FROM ? value > to : value < from;
  }

  static validateScaleDensity(density: number): number {
    if (density < 0.5) {
      return 0.5;
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
    const newMin = min;
    const newMax = min === max ? max + 1 : max;

    return newMin > newMax ? [newMax, newMin] : [newMin, newMax];
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
    this.state = Model.DEFAULT_STATE;
  }

  public init({
    from = Model.DEFAULT_STATE.from,
    to = Model.DEFAULT_STATE.to,
    min = Model.DEFAULT_STATE.min,
    max = Model.DEFAULT_STATE.max,
    step = Model.DEFAULT_STATE.step,
    orientation = Model.DEFAULT_STATE.orientation,
    direction = Model.DEFAULT_STATE.direction,
    range = Model.DEFAULT_STATE.range,
    tooltips = Model.DEFAULT_STATE.tooltips,
    progressBar = Model.DEFAULT_STATE.progressBar,
    scale = Model.DEFAULT_STATE.scale,
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
      precision: 1,
      scale: null,
    };

    this.setMinMax(min, max);
    this.setStep(step);
    this.updatePrecision();
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
          this.updatePrecision();
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
    const newType = this.setHandle(type, value, shouldAdjust);

    const event = newType === FROM ? HANDLE_FROM_MOVE : HANDLE_TO_MOVE;
    const { events } = UPDATES[event];

    this.eventManager.dispatchEvents(events);
  }

  private setHandle(
    type: HandleType,
    value?: number,
    shouldAdjust = true
  ): HandleType {
    const newValue = value ?? this.state[type];
    const { step, precision, from, to, range } = this.state;

    const adjusted = shouldAdjust ?
      this.adjustHandle(newValue, step) :
      newValue;

    const validated = this.validateHandle(newValue);
    const valueToSet = newValue !== validated ? validated : adjusted;

    const isCollided = Model.areHandlesCollided(
      validated,
      type,
      from,
      to,
      range
    );

    let newType = type;

    if (isCollided) {
      this.eventManager.dispatchEvent(HANDLES_SWAP);
      newType = type === FROM ? TO : FROM;
    }

    this.state[type] = this.state[newType];
    this.state[newType] = Model.adjustFloat(valueToSet, precision);

    return newType;
  }

  private adjustHandle(value: number, step: number): number {
    const adjusted = this.adjustWithStep(value, step);
    const validated = this.validateHandle(adjusted);
    return validated;
  }

  private adjustWithStep(value: number, step: number): number {
    const { min } = this.state;
    const relativeValue = value + (min * (-1));

    const adjusted = (Math.round(relativeValue / step) * step) + min;
    return adjusted;
  }

  private validateHandle(value: number): number {
    const { min, max } = this.state;

    const validatedOnMinMax = Model.validateHandleOnMinMax(
      value,
      min,
      max
    );

    return validatedOnMinMax;
  }

  private updatePrecision(): void {
    const { min, max, step } = this.state;

    const minPrecision = Math.max(
      Model.getNumberOfDecimals(min),
      Model.getNumberOfDecimals(max),
      Model.getNumberOfDecimals(step)
    );

    this.state.precision = minPrecision;
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
      density = currentScale?.density ?? 3,
      lines = currentScale?.lines ?? true,
      numbers = currentScale?.numbers ?? true,
    } = newScale;

    this.state.scale = {
      lines,
      numbers,
      density,
      segments: [],
    };

    this.setScaleDensity(density);
    this.generateScaleSegments();
  }

  private generateScaleSegments(): void {
    if (this.state.scale === null) return;

    const { density } = this.state.scale;
    const { min, max, step, precision } = this.state;

    const stepsAmount = (max - min) / step;
    const lineStep = (max - min) * density / 100;
    const numberStep = (Math.trunc(stepsAmount / 100) + 1) * step;

    for (
      let value = min;
      value < max;
      value = Model.adjustFloat(value + numberStep, precision)
    ) {
      const numberSegment: Segment = {
        value,
        type: NUMBER,
      };

      this.state.scale.segments.push(numberSegment);

      let nextValue = value + numberStep;
      nextValue = nextValue >= max ? max : nextValue;
      const distanceToNextValue = Model.adjustFloat(
        nextValue - value,
        precision
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

    const precision = Math.max(
      Model.getNumberOfDecimals(min),
      Model.getNumberOfDecimals(max),
    );

    const length = Model.adjustFloat(max - min, precision);

    this.state.step = Model.validateStep(newStep, length);
  }
}

export default Model;
