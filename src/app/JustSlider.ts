import Presenter from "./Presenter/Presenter";
import { Direction, Options, Orientation } from "./types";

class JustSlider {
  private presenter: Presenter;

  constructor($parent: JQuery<HTMLElement>, presenter: Presenter) {
    this.presenter = presenter;
    const $slider = this.presenter.$getSlider();
    $parent.append($slider);
  }

  public updateTooltips(value: boolean) {
    this.presenter.updateTooltips(value);
  }

  public updateRange(value: boolean) {
    this.presenter.updateRange(value);
  }

  public updateProgressBar(value: boolean) {
    this.presenter.updateProgressBar(value);
  }

  public updateDirection(value: Direction) {
    this.presenter.updateDirection(value);
  }

  public updateOrientation(value: Orientation) {
    this.presenter.updateOrientation(value);
  }

  public updateStep(value: number) {
    this.presenter.updateStep(value);
  }

  public updateMax(value: number) {
    this.presenter.updateMax(value);
  }

  public updateMin(value: number) {
    this.presenter.updateMax(value);
  }

  public updateHandle(type: HandleType, value: number) {
    this.presenter.updateHandle(type, value);
  }

  public updateOptions(options: Options) {
    this.presenter.updateOptions(options);
  }
}

export default JustSlider;