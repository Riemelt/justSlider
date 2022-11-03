import Presenter from "../Presenter/Presenter";
import { Options } from "../types";

class JustSlider {
  private presenter: Presenter;

  constructor($parent: JQuery<HTMLElement>, presenter: Presenter) {
    this.presenter = presenter;
    const $slider = this.presenter.$getSlider();
    $parent.append($slider);
  }

  public updateHandle(type: HandleType, value: number) {
    this.presenter.updateHandle(type, value);
  }

  public updateOptions(options: Options) {
    this.presenter.updateOptions(options);
  }
}

export default JustSlider;