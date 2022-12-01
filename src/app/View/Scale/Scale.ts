import {
  Direction,
  Orientation,
  State,
} from "../../types";
import {
  getPositionStyles,
  getValueBasedOnPrecision,
} from "../utilities/utilities";
import {
  BIG,
  LARGE,
  LINE,
  NORMAL,
} from "./constants";
import {
  LineSegmentSize,
} from "./types";

class Scale {
  private $component: JQuery<HTMLElement>;

  private handleNumberClick: (position: number) => void = () => { return; };

  static readonly NUMBER_CLASS = "just-slider__scale-number";
  static readonly LINE_CLASS   = "just-slider__scale-line";

  constructor($parent: JQuery<HTMLElement>) {
    this.$component = this.initHtml();
    this.init($parent);
  }

  public setNumberClickHandler(handler: (position: number) => void): void {
    this.handleNumberClick = handler;
  }

  public delete(): void {
    const $numberSegments = this.$component.find(`.${Scale.NUMBER_CLASS}`);
    $numberSegments.off("click.scale");
    
    this.$component.remove();
  }

  public update(state: State): void {
    this.$component.empty();
    if (state.scale === null) return;

    const { min, max, orientation, direction, precision } = state;
    const { segments, numbers, lines } = state.scale;

    this.setStyleModifier(lines);

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
      
      if (type === LINE) {
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
        const lineSegmentSize = isBig ? LARGE : BIG;
        const $lineSegment    = this.createLineSegment(lineSegmentSize);
        this.updatePosition({
          ...updatePositionOptions,
          $element: $lineSegment,
        });
      }

      if (numbers) {
        const $numberSegment = this.createNumberSegment(value, precision, isBig);
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
  }): void {
    const { $element, shift, min, max, direction, orientation } = options;
    const { property, style } = getPositionStyles({ shift, min, max, direction, orientation });

    $element.css(property, style);
  }

  private isFirstOrLast(index: number, length: number): boolean {
    return index === 0 || index === length - 1;
  }

  private setStyleModifier(lines: boolean): void {
    if (lines) {
      this.$component.removeClass("just-slider__scale_without-lines");
    } else {
      this.$component.addClass("just-slider__scale_without-lines");
    }
  }

  private createNumberSegment(value: number, precision: number, isBig = false): JQuery<HTMLElement> {
    const converted = getValueBasedOnPrecision(value, precision);
    const $segment  = $(`<div class="${Scale.NUMBER_CLASS}">${converted}</div>`);
    $segment.on("click.scale", this.handleScaleNumberClick.bind(this, value));

    if (isBig) {
      $segment.addClass("just-slider__scale-number_big");
    }

    this.$component.append($segment);

    return $segment;
  }

  private handleScaleNumberClick(value: number) {
    this.handleNumberClick(value);
  }

  private createLineSegment(size: LineSegmentSize = NORMAL): JQuery<HTMLElement> {
    const $segment = $(`<div class="${Scale.LINE_CLASS}"></div>`);

    if (size === BIG) {
      $segment.addClass("just-slider__scale-line_big");
    }

    if (size === LARGE) {
      $segment.addClass("just-slider__scale-line_large");
    }

    this.$component.append($segment);

    return $segment;
  }

  private init($parent: JQuery<HTMLElement>): void {
    $parent.append(this.$component);
  }

  private initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__scale">
      </div>
    `);
  }
}

export default Scale;