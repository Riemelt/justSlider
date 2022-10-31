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
  public updateMin:         (value: number) => void;
  public updateMax:         (value: number) => void;
  public updateStep:        (value: number) => void;
  public updateOrientation: (value: Orientation) => void;
  public updateDirection:   (value: Direction) => void;
  public updateRange:       (value: boolean) => void;
  public updateProgressBar: (value: boolean) => void;
  public updateTooltips:    (value: boolean) => void;
}

export {
  Orientation,
  Direction,
  Options,
  JustSliderOptions,
  JustSlider,
}