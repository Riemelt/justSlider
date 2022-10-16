import { translate } from "../../utilities";

class ProgressBar {
  private $bar: JQuery<HTMLElement>;
  private $point: JQuery<HTMLElement>;
  private options: Options;

  constructor($parent: JQuery<HTMLElement>) {
    this.init($parent);
  }

  public update(options: Options) {
    this.options = options;
    const { min, max, from, to, isRange, orientation, direction } = options;

    const start = isRange ? from : min;
    const end   = isRange ? to : from;

    const sliderLength = max - min;
    const barLength    = end - start;
    const scale        = barLength / sliderLength;
    
    this.updateScale(scale, orientation);

    const shift = direction === "forward" ? end : start;
    this.updatePosition(shift, min, max, orientation, direction);
  }

  public delete() {
    this.$point.remove();
  }

  private updatePosition(shift: number, min: number, max: number, orientation: Orientation, direction: Direction) {
    const translateStyle = translate(shift, min, max, orientation, direction);
    this.$point.css("transform", `${translateStyle}`);
  }

  private updateScale(scale: number, orientation: Orientation) {
    const axis = orientation === "horizontal" ? "X" : "Y";
    this.$bar.css("transform", `scale${axis}(${scale})`);
  }

  private init($parent: JQuery<HTMLElement>) {
    this.initHtml();

    $parent.append(this.$point);
  }

  private initHtml() {
    this.$point = $(`
      <div class="just-slider__point just-slider__point_type-bar">
        <div class="just-slider__progress-bar">
        </div>
      </div>
    `);

    this.$bar = this.$point.find(".just-slider__progress-bar");
  }
}

export default ProgressBar;