import Presenter from "../Presenter/Presenter";

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

interface JustSliderOptions {
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

declare class JustSlider {
  private presenter: Presenter;
  constructor($parent: JQuery<HTMLElement>, presenter: Presenter);
  public updateOptions:     (options: Options) => void;
  public updateHandle:      (type: HandleType, value: number) => void;
}

export {
  Orientation,
  Direction,
  Options,
  JustSliderOptions,
  JustSlider,
}