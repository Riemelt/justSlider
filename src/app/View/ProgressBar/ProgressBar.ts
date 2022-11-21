import {
  Direction,
  State,
  Orientation
} from "../../types";

import { getTransformStyles } from "../utilities";

class ProgressBar {
  private $component: JQuery<HTMLElement>;
  private $bar:       JQuery<HTMLElement>;

  constructor($parent: JQuery<HTMLElement>) {
    this.init($parent);
  }

  public update(state: State): void {
    const { min, max, from, to, range, orientation, direction } = state;

    const start = range ? from : min;
    const end   = range ? to : from;
    const shift = direction === "forward" ? end : start;

    const sliderLength = max - min;
    const barLength    = end - start;
    const scale        = barLength / sliderLength;

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
    shift:       number,
    min:         number,
    max:         number,
    orientation: Orientation,
    direction:   Direction,
    scale?:      number,
  }): void {
    const { property, style } = getTransformStyles(options)
    this.$bar.css(property, style);
  }

  private init($parent: JQuery<HTMLElement>): void {
    this.initHtml();

    $parent.append(this.$component);
  }

  private initHtml(): void {
    this.$component = $(`
      <div class="just-slider__progress-bar-wrapper">
        <div class="just-slider__progress-bar">
        </div>
      </div>
    `);

    this.$bar = this.$component.find(".just-slider__progress-bar");
  }
}

export default ProgressBar;