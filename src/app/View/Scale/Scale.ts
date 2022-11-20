import { getPositionStyles } from "../utilities";
import { Direction, Orientation, State } from "../../types";

class Scale {
  private $component: JQuery<HTMLElement>;

  private numberClass = "just-slider__scale-number";
  private lineClass   = "just-slider__scale-line";

  private handleNumberClick: (position: number) => void;

  constructor($parent: JQuery<HTMLElement>) {
    this.init($parent);
  }

  public setNumberClickHandler(handler: (position: number) => void) {
    this.handleNumberClick = handler;
  }

  public delete() {
    const $numberSegments = this.$component.find(`.${this.numberClass}`);
    $numberSegments.off("click.scale");
    
    this.$component.remove();
  }

  public update(state: State) {
    const { min, max, orientation, direction } = state;
    const { segments, numbers, lines } = state.scale;

    this.setStyleModificator(lines);

    segments.forEach((segment, index) => {
      const { type, value } = segment;
      
      if (type === "line") {
        if (lines) {
          const $segment = this.createLineSegment();
          this.updatePosition({
            min,
            max,
            direction,
            orientation,
            shift: value,
            $element: $segment,
          });
        }

        return;
      }

      if (numbers) {
        const isBig = this.isFirstOrLast(index, segments.length);
        const $segment = this.createNumberSegment(value, isBig);
        this.updatePosition({
          min,
          max,
          direction,
          orientation,
          shift: value,
          $element: $segment,
        });
      }
    });
  }

  private updatePosition(options: {
    $element:    JQuery<HTMLElement>,
    shift:       number,
    min:         number,
    max:         number,
    direction:   Direction,
    orientation: Orientation,
  }) {
    const { $element, shift, min, max, direction, orientation } = options;
    const { property, style } = getPositionStyles({ shift, min, max, direction, orientation });

    $element.css(property, style);
  }

  private isFirstOrLast(index: number, length: number): boolean {
    return index === 0 || index === length - 1;
  }

  private setStyleModificator(lines: boolean) {
    if (lines) {
      this.$component.removeClass("just-slider__scale_without-lines");
    } else {
      this.$component.addClass("just-slider__scale_without-lines");
    }
  }

  private createNumberSegment(value: number, isBig: boolean): JQuery<HTMLElement> {
    const $segment = $(`<div class="${this.numberClass}">${value}</div>`);
    $segment.on("click.scale", this.handleNumberClick.bind(this, value));

    if (isBig) {
      $segment.addClass("just-slider__scale-number_big");
    }

    this.$component.append($segment);

    return $segment;
  }

  private createLineSegment(): JQuery<HTMLElement> {
    const $segment = $(`<div class="${this.lineClass}"></div>`);
    this.$component.append($segment);

    return $segment;
  }

  private init($parent: JQuery<HTMLElement>) {
    this.initHtml();

    $parent.append(this.$component);
  }

  private initHtml() {
    this.$component = $(`<div class="just-slider__scale"></div>`);
  }
}

export default Scale;