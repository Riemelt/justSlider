import Presenter from "../Presenter/Presenter";
import { JustSliderOptions, Options } from "../types";

declare class JustSlider {
  private presenter: Presenter;
  constructor($parent: JQuery<HTMLElement>, presenter: Presenter, options: JustSliderOptions);
  public updateOptions:     (options: Options) => void;
  public update:      (type: HandleType, value: number) => void;
}

export {
  JustSlider,
}