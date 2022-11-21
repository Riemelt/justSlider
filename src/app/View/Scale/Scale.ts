import {
  getPositionStyles,
  getValueBasedOnPrecision,
} from "../utilities/utilities";

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
    this.$component.empty();

    const { min, max, orientation, direction, precision } = state;
    const { segments, numbers, lines } = state.scale;

    this.setStyleModificator(lines);

    segments.forEach((segment, index) => {
      const { type, value } = segment;

      const updatePositionOptions = {
        min,
        max,
        direction,
        orientation,
        shift: value,
      }

      const isBig = this.isFirstOrLast(index, segments.length);
      
      if (type === "line") {
        if (lines) {
          const $segment = this.createLineSegment();
          this.updatePosition({
            ...updatePositionOptions,
            $element: $segment,
          });
        }

        return;
      }

      if (lines) {
        const lineSegmentSize = isBig ? "large" : "big";
        const $lineSegment    = this.createLineSegment(lineSegmentSize);
        this.updatePosition({
          ...updatePositionOptions,
          $element: $lineSegment,
        });
      }

      if (numbers) {
        const $numberSegment = this.createNumberSegment(value, isBig, precision);
        this.updatePosition({
          ...updatePositionOptions,
          $element: $numberSegment,
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

  private createNumberSegment(value: number, isBig = false, precision: number): JQuery<HTMLElement> {
    const converted = getValueBasedOnPrecision(value, precision);
    const $segment = $(`<div class="${this.numberClass}">${converted}</div>`);
    $segment.on("click.scale", () => this.handleNumberClick(value));

    if (isBig) {
      $segment.addClass("just-slider__scale-number_big");
    }

    this.$component.append($segment);

    return $segment;
  }

  private createLineSegment(size: "normal" | "big" | "large" = "normal"): JQuery<HTMLElement> {
    const $segment = $(`<div class="${this.lineClass}"></div>`);

    if (size === "big") {
      $segment.addClass("just-slider__scale-line_big");
    }

    if (size === "large") {
      $segment.addClass("just-slider__scale-line_large");
    }

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