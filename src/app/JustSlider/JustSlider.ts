import Presenter from '../Presenter/Presenter';
import { HandleType } from '../Model/types';
import { FROM, TO } from '../Model/constants';
import { JustSliderOptions, State } from '../types';

class JustSlider {
  private presenter: Presenter;
  private readonly options: JustSliderOptions;

  constructor(
    $parent: JQuery<HTMLElement>,
    presenter: Presenter,
    options: JustSliderOptions = {}
  ) {
    this.options = options;
    this.presenter = presenter;
    const $slider = this.presenter.$getSlider();
    $parent.append($slider);
  }

  public getState(): State {
    return this.presenter.getState();
  }

  public get(): number | Array<number> {
    const { range, from, to } = this.presenter.getState();
    return range ? [from, to] : from;
  }

  public $slider(): JQuery<HTMLElement> {
    return this.presenter.$getSlider();
  }

  public reset(): void {
    const {
      from = 0,
      to = 0,
    } = this.options;

    this.presenter.updateHandle(TO, to);
    this.presenter.updateHandle(FROM, from);
  }

  public update(type: HandleType, value: number) {
    this.presenter.updateHandle(type, value);
  }

  public updateOptions(options: JustSliderOptions) {
    this.presenter.updateOptions(options);
  }
}

export default JustSlider;
