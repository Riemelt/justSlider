import { JustSlider } from '../JustSlider/types';
import { BACKWARD, FORWARD, HORIZONTAL, VERTICAL } from '../Model/constants';
import { ScaleOptions, ScaleState } from '../View/Scale/types';

type Orientation = typeof VERTICAL | typeof HORIZONTAL;
type Direction = typeof FORWARD | typeof BACKWARD;

interface Options {
  from?: number;
  to?: number;
  step?: number;
  min?: number;
  max?: number;
  orientation?: Orientation;
  direction?: Direction;
  range?: boolean;
  tooltips?: boolean;
  progressBar?: boolean;
  scale?: ScaleOptions | null;
}

type State = Required<Options> & {
  scale: ScaleState | null;
  precision: number;
}

interface JustSliderOptions extends Options {
  onUpdate?: (state: State) => void;
}

type HTMLElementEvent<T extends HTMLElement> = JQuery.Event & {
  target: T;
  currentTarget: T;
}

export {
  Orientation,
  Direction,
  Options,
  State,
  JustSliderOptions,
  JustSlider,
  HTMLElementEvent,
};
