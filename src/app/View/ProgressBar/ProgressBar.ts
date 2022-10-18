import { transform } from "../utilities";

class ProgressBar {
  private $component: JQuery<HTMLElement>;
  private $bar: JQuery<HTMLElement>;
  private options: Options;

  constructor($parent: JQuery<HTMLElement>) {
    this.init($parent);
  }

  public update(options: Options) {
    this.options = options;
    const { min, max, from, to, range, orientation, direction } = options;

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

  public delete() {
    this.$component.remove();
  }

  private updatePosition(transformOptions: TransformOptions) {
    const transformStyle = transform(transformOptions)
    this.$bar.css("transform", transformStyle);
  }

  private init($parent: JQuery<HTMLElement>) {
    this.initHtml();

    $parent.append(this.$component);
  }

  private initHtml() {
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