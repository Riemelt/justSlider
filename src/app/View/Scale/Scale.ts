import {
  checkCollision,
  distanceToContainer,
  getPositionStyles,
  getValueBasedOnPrecision,
  isBiggerThanContainer,
  LEFT,
  RIGHT,
} from '../../utilities/utilities';
import { FORWARD, VERTICAL } from '../../Model/constants';
import { Direction, Orientation, State } from '../../types';
import { BIG, LARGE, LINE, NORMAL } from './constants';
import { LineSize } from './types';

class Scale {
  private $component: JQuery<HTMLElement>;
  private numberSegments: Array<JQuery<HTMLElement>>;
  private state: State;

  private handleNumberClick?: (position: number) => void;

  static readonly NUMBER_CLASS = 'just-slider__scale-number';
  static readonly LINE_CLASS = 'just-slider__scale-line';

  static $initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__scale">
      </div>
    `);
  }

  static isFirstOrLast(index: number, length: number): boolean {
    return index === 0 || index === length - 1;
  }

  static updatePosition(options: {
    $element: JQuery<HTMLElement>,
    shift: number,
    min: number,
    max: number,
    direction: Direction,
    orientation: Orientation,
  }): void {
    const { $element, shift, min, max, direction, orientation } = options;
    const { property, style } = getPositionStyles({
      shift,
      min,
      max,
      direction,
      orientation,
    });

    $element.css(property, style);
  }

  static hideNumberSegment($segment: JQuery<HTMLElement>) {
    $segment.addClass('just-slider__scale-number_hidden');
  }

  static showNumberSegment($segment: JQuery<HTMLElement>) {
    $segment.removeClass('just-slider__scale-number_hidden');
  }

  constructor($parent: JQuery<HTMLElement>, state: State) {
    this.$component = Scale.$initHtml();
    this.numberSegments = [];
    this.state = state;
    this.init($parent);
  }

  public hideIfBiggerThanContainer($container: JQuery<HTMLElement>) {
    this.numberSegments.forEach(($segment) => {
      if (this.state.orientation === VERTICAL) {
        const distanceRight = distanceToContainer({
          $container,
          $element: $segment,
          side: RIGHT,
        });

        if (distanceRight > 0) {
          Scale.hideNumberSegment($segment);
          return;
        }
      }

      if (isBiggerThanContainer($container, $segment)) {
        Scale.hideNumberSegment($segment);
      }
    });
  }

  public getRequiredMargin(
    $container: JQuery<HTMLElement>,
    offset: number,
  ): number {
    const first = this.numberSegments[0];
    const last = this.numberSegments[this.numberSegments.length - 1];

    if (first?.outerWidth() === 0 ||
      last?.outerWidth() === 0 ||
      this.numberSegments.length === 0
    ) {
      return 0;
    }

    const firstDistance = distanceToContainer({
      $container,
      offset: (this.state.direction === FORWARD ? 1 : (-1)) * offset,
      $element: first,
      side: this.state.direction === FORWARD ? LEFT : RIGHT,
    });

    const lastDistance = distanceToContainer({
      $container,
      offset: (this.state.direction === FORWARD ? -1 : (1)) * offset,
      $element: last,
      side: this.state.direction === FORWARD ? RIGHT : LEFT,
    });

    return Math.max(firstDistance, lastDistance, 0);
  }

  public setNumberClickHandler(handler: (position: number) => void): void {
    this.handleNumberClick = handler;
  }

  public delete(): void {
    const $numberSegments = this.$component.find(`.${Scale.NUMBER_CLASS}`);
    $numberSegments.off('click.scale');

    this.$component.remove();
  }

  public update(state: State): void {
    this.$component.empty();
    this.numberSegments = [];
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
      };

      const isBig = Scale.isFirstOrLast(index, segments.length);

      if (type === LINE) {
        if (lines) {
          const $segment = this.createLineSegment();
          Scale.updatePosition({
            ...updatePositionOptions,
            $element: $segment,
          });
        }

        return;
      }

      if (lines) {
        const lineSegmentSize = isBig ? LARGE : BIG;
        const $lineSegment = this.createLineSegment(lineSegmentSize);
        Scale.updatePosition({
          ...updatePositionOptions,
          $element: $lineSegment,
        });
      }

      if (numbers) {
        const $numberSegment = this.createNumberSegment(
          value,
          precision,
          isBig
        );

        this.numberSegments.push($numberSegment);

        Scale.updatePosition({
          ...updatePositionOptions,
          $element: $numberSegment,
        });
      }
    });
  }

  public hideSegmentsOnCollision() {
    this.numberSegments.forEach(($segment) => {
      Scale.hideNumberSegment($segment);
    });

    const getVisible = function getVisible(
      segments: Array<JQuery<HTMLElement>>
    ) {
      const segmentsVisibility = segments.map(($segment) => ({
        $segment,
        visible: true,
      }));

      let current = 0;

      for (let i = 1; i < segments.length; i += 1) {
        const next = i;
        const collided = checkCollision(segments[current], segments[next]);

        if (collided) {
          if (i === segments.length - 1) {
            segmentsVisibility[current].visible = false;
            segmentsVisibility[next].visible = true;
            continue;
          }

          segmentsVisibility[current].visible = true;
          segmentsVisibility[next].visible = false;
          continue;
        }

        segmentsVisibility[current].visible = true;
        segmentsVisibility[next].visible = true;
        current = next;
      }

      return segmentsVisibility.filter((segment) => segment.visible);
    };

    const visibleForward = getVisible(this.numberSegments);
    const visibleBackward = getVisible(visibleForward.map((element) => (
      element.$segment
    )));

    visibleBackward.forEach((segment) => {
      Scale.showNumberSegment(segment.$segment);
    });
  }

  private setStyleModifier(lines: boolean): void {
    if (lines) {
      this.$component.removeClass('just-slider__scale_without-lines');
      return;
    }

    this.$component.addClass('just-slider__scale_without-lines');
  }

  private createNumberSegment(
    value: number,
    precision: number,
    isBig = false
  ): JQuery<HTMLElement> {
    const converted = getValueBasedOnPrecision(value, precision);
    const $segment = $(`<div class="${Scale.NUMBER_CLASS}">${converted}</div>`);
    $segment.on('click.scale', this.handleScaleNumberClick.bind(this, value));

    if (isBig) {
      $segment.addClass('just-slider__scale-number_big');
    }

    this.$component.append($segment);

    return $segment;
  }

  private handleScaleNumberClick(value: number): void {
    this.handleNumberClick?.(value);
  }

  private createLineSegment(size: LineSize = NORMAL): JQuery<HTMLElement> {
    const $segment = $(`<div class="${Scale.LINE_CLASS}"></div>`);

    if (size === BIG) {
      $segment.addClass('just-slider__scale-line_big');
    }

    if (size === LARGE) {
      $segment.addClass('just-slider__scale-line_large');
    }

    this.$component.append($segment);

    return $segment;
  }

  private init($parent: JQuery<HTMLElement>): void {
    $parent.append(this.$component);
  }
}

export default Scale;
