import { FORWARD, FROM, RANGE } from '../../Model/constants';
import { TooltipType } from '../../Model/types';
import { Direction, Orientation, State } from '../../types';
import {
  getTransformStyles,
  getValueBasedOnPrecision,
} from '../utilities/utilities';
import { TooltipOptions } from './types';

class Tooltip {
  private $component: JQuery<HTMLElement>;
  private $tooltip: JQuery<HTMLElement>;
  private type: TooltipType = FROM;

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
  }: TooltipOptions) {
    this.$component = Tooltip.initHtml();
    this.$tooltip = this.$component.find('.just-slider__tooltip');
    this.type = type;
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
