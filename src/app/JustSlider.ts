import Presenter from "./Presenter/Presenter";
import { Options } from "./types";

class JustSlider {
  private presenter: Presenter;

  constructor($parent: JQuery<HTMLElement>, presenter: Presenter) {
    this.presenter = presenter;
    const $slider = this.presenter.$getSlider();
    $parent.append($slider);
  }

  public update(options: Options) {
    //
  }
}

export default JustSlider;