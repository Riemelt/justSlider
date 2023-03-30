import { FORWARD, FROM, RANGE, VERTICAL } from '../../Model/constants';
import { TooltipType } from '../../Model/types';
import { Direction, Orientation, State } from '../../types';
import {
  distanceToContainer,
  getTransformStyles,
  getValueBasedOnPrecision,
  isBiggerThanContainer,
  LEFT,
  RIGHT,
} from '../../utilities/utilities';
import { TooltipOptions } from './types';

class Tooltip {
  private $component: JQuery<HTMLElement>;
  private $tooltip: JQuery<HTMLElement>;
  private state: State;
  private type: TooltipType = FROM;
  private offset = 0;

  static initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__point just-slider__point_type_tooltip">
        <div class="just-slider__tooltip">
        </div>
      </div>
    `);
  }

  constructor({
    $parent,
    type,
    state,
  }: TooltipOptions) {
    this.$component = Tooltip.initHtml();
    this.$tooltip = this.$component.find('.just-slider__tooltip');
    this.type = type;
    this.state = state;
    this.init($parent);
  }

  public $getHtml(): JQuery<HTMLElement> {
    return this.$tooltip;
  }

  public update(state: State): void {
    const { from, to, precision, direction } = state;
    const firstValue = this.type === RANGE ? from : state[this.type];
    const firstConverted = getValueBasedOnPrecision(firstValue, precision);
    let text = firstConverted;

    if (this.type === RANGE) {
      const secondConverted = getValueBasedOnPrecision(to, precision);
      const smaller = direction === FORWARD ? firstConverted : secondConverted;
      const bigger = direction === FORWARD ? secondConverted : firstConverted;
      text = `${smaller} - ${bigger}`;
    }

    this.$tooltip.html(text);
    this.updatePosition(state);
  }

  public updatePosition(state: State) {
    const { from, to, min, max, orientation, direction } = state;
    const middle = from + ((to - from) / 2);
    const value = this.type === RANGE ? middle : state[this.type];

    this.setPosition({
      min,
      max,
      orientation,
      direction,
      shift: value,
    });
  }

  public fixPosition($container: JQuery<HTMLElement>): void {
    let newOffset = 0;

    if (this.state.orientation === VERTICAL) {
      this.setOffset(newOffset);
      return;
    }

    const distanceLeft = distanceToContainer({
      $container,
      $element: this.$tooltip,
      side: LEFT,
      offset: this.offset,
    });

    if (distanceLeft > 0) {
      newOffset = distanceLeft;
      this.setOffset(newOffset);
      return;
    }

    const distanceRight = distanceToContainer({
      $container,
      $element: this.$tooltip,
      side: RIGHT,
      offset: this.offset,
    });

    if (distanceRight > 0) {
      newOffset = -distanceRight;
    }

    this.setOffset(newOffset);
  }

  public hideIfBiggerThanContainer($container: JQuery<HTMLElement>): void {
    if (this.state.orientation === VERTICAL) {
      const distanceLeft = distanceToContainer({
        $container,
        $element: this.$tooltip,
        side: LEFT,
      });

      if (distanceLeft > 0) {
        this.hide();
        return;
      }
    }

    if (isBiggerThanContainer($container, this.$tooltip)) {
      this.hide();
    }
  }

  public delete(): void {
    this.$component.remove();
  }

  public hide(): void {
    this.$component.addClass('just-slider__point_hidden');
  }

  public show(): void {
    this.$component.removeClass('just-slider__point_hidden');
  }

  public setType(type: TooltipType): void {
    this.type = type;
  }

  private setOffset(value: number): void {
    this.offset = value;
    this.$component.css('left', `${value}px`);
  }

  private setPosition(options: {
    shift: number,
    min: number,
    max: number,
    orientation: Orientation,
    direction: Direction,
    scale?: number,
  }): void {
    const { property, style } = getTransformStyles(options);
    this.$component.css(property, style);
  }

  private init($parent: JQuery<HTMLElement>): void {
    $parent.append(this.$component);
  }
}

export default Tooltip;
