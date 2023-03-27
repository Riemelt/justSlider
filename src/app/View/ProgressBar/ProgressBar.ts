import {
  FORWARD,
} from '../../Model/constants';
import {
  Direction,
  State,
  Orientation,
} from '../../types';
import {
  getTransformStyles,
} from '../../utilities/utilities';

class ProgressBar {
  private $component: JQuery<HTMLElement>;
  private $bar: JQuery<HTMLElement>;

  static initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__progress-bar-wrapper">
        <div class="just-slider__progress-bar">
        </div>
      </div>
    `);
  }

  constructor($parent: JQuery<HTMLElement>) {
    this.$component = ProgressBar.initHtml();
    this.$bar = this.$component.find('.just-slider__progress-bar');
    $parent.append(this.$component);
  }

  public update(state: State): void {
    const { range, min, max, from, to, orientation, direction } = state;

    const start = range ? from : min;
    const end = range ? to : from;
    const shift = direction === FORWARD ? end : start;

    const sliderLength = max - min;
    const barLength = end - start;
    const scale = barLength / sliderLength;

    this.updatePosition({
      min,
      max,
      orientation,
      direction,
      shift,
      scale,
    });
  }

  public delete(): void {
    this.$component.remove();
  }

  private updatePosition(options: {
    shift: number,
    min: number,
    max: number,
    orientation: Orientation,
    direction: Direction,
    scale?: number,
  }): void {
    const { property, style } = getTransformStyles(options);
    this.$bar.css(property, style);
  }
}

export default ProgressBar;
