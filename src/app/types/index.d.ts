import EventManager from "../EventManager/EventManager";
import { JustSlider } from "../JustSlider/types";

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
}

interface JustSliderOptions extends Options {
  onUpdate?: (options: Options) => void;
}

interface IAccessEventManager {
  eventManager: EventManager;
  setEventManager: (eventManager: EventManager) => void;
}

export {
  Orientation,
  Direction,
  Options,
  JustSliderOptions,
  JustSlider,
  IAccessEventManager,
}