import Presenter from "../Presenter/Presenter";
import { Options } from "../types";

declare class JustSlider {
  private presenter: Presenter;
  constructor($parent: JQuery<HTMLElement>, presenter: Presenter);
  public updateOptions:     (options: Options) => void;
  public updateHandle:      (type: HandleType, value: number) => void;
}

export {
  JustSlider,
}