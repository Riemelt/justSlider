import Presenter from "../Presenter/Presenter";
import { JustSliderOptions, State } from "../types";

declare class JustSlider {
  private presenter: Presenter;
  constructor($parent: JQuery<HTMLElement>, presenter: Presenter, options: JustSliderOptions);
  public updateOptions: (options: JustSliderOptions) => void;
  public update:        (type: HandleType, value: number) => void;
  public getState:      () => State;
  public get:           () => number | Array<number>;
  public $slider:       () => JQuery<HTMLElement>;
  public reset:         () => void;
}

export {
  JustSlider,
} 