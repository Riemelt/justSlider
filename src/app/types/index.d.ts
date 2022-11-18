import { JustSlider } from "../JustSlider/types";
import { ScaleOptions, ScaleState } from "../View/Scale/types";

type Orientation = "vertical" | "horizontal";
type Direction   = "forward" | "backward";

interface Options {
  from?:        number;
  to?:          number;
  step?:        number;
  min?:         number;
  max?:         number;
  orientation?: Orientation;
  direction?:   Direction;
  range?:       boolean;
  tooltips?:    boolean;
  progressBar?: boolean;
  scale?:       ScaleOptions | null;
}

interface State extends Options {
  scale?: ScaleState | null;
}

interface JustSliderOptions extends Options {
  onUpdate?: (options: Options) => void;
}

export {
  Orientation,
  Direction,
  Options,
  State,
  JustSliderOptions,
  JustSlider,
}