import {
  FORWARD,
  FROM,
  HORIZONTAL,
  RANGE,
  VERTICAL,
} from '../../Model/constants';
import { TooltipType } from '../../Model/types';
import { Direction, Orientation, State } from '../../types';
import {
  distanceToContainer,
  getElementCenterPos,
  getTransformStyles,
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
  private shiftFromCenter = 0;
  private handleTooltipPointermove?: (
    position: number,
    type: TooltipType,
    redirectEvent?: JQuery.Event,
  ) => void;

  static $initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__point just-slider__point_type_tooltip">
        <div class="just-slider__tooltip">
        </div>
      </div>
    `);
  }

  static handleDocumentPointerup(): void {
    $(document).off('pointerup.tooltip');
    $(document).off('pointermove.tooltip');
  }

  constructor({
    $parent,
    type,
    state,
  }: TooltipOptions) {
    this.$component = Tooltip.$initHtml();
    this.$tooltip = this.$component.find('.just-slider__tooltip');
    this.type = type;
    this.state = state;
    this.setHandlers();
    this.init($parent);
  }

  public $getHtml(): JQuery<HTMLElement> {
    return this.$tooltip;
  }

  public update(state: State): void {
    const text = this.getText(state);
    this.$tooltip.html(text);
    this.updatePosition(state);
  }

  public updatePosition(state: State): void {
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
    if (this.state.orientation === VERTICAL) {
      this.setOffset(0);
      return;
    }

    const distanceLeft = distanceToContainer({
      $container,
      $element: this.$tooltip,
      side: LEFT,
      offset: this.offset,
    });

    if (distanceLeft > 0) {
      this.setOffset(distanceLeft);
      return;
    }

    const distanceRight = distanceToContainer({
      $container,
      $element: this.$tooltip,
      side: RIGHT,
      offset: this.offset,
    });

    const newOffset = distanceRight > 0 ? -distanceRight : 0;
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
    this.deleteHandlers();
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

  public setTooltipPointermoveHandler(handler: (
    position: number,
    type: TooltipType,
    redirectEvent?: JQuery.Event,
  ) => void): void {
    this.handleTooltipPointermove = handler;
  }

  private getText(state: State): string {
    const { from, to, direction } = state;
    const firstValue = this.type === RANGE ? from : state[this.type];

    if (this.type !== RANGE) {
      return `${firstValue}`;
    }

    const secondValue = to;
    const smaller = direction === FORWARD ? firstValue : secondValue;
    const bigger = direction === FORWARD ? secondValue : firstValue;

    return `${smaller} - ${bigger}`;
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

  private setHandlers(): void {
    this.$tooltip.on('pointerdown.tooltip', this.handlePointerdown.bind(this));
  }

  private deleteHandlers(): void {
    this.$tooltip.off('pointerdown.tooltip', this.handlePointerdown.bind(this));
  }

  private redirect(event: JQuery.Event): void {
    const {
      pageX = 0,
      pageY = 0,
    } = event;

    const position = this.state.orientation === HORIZONTAL ? pageX : pageY;
    this.handleTooltipPointermove?.(position, this.type, event);
  }

  private handlePointerdown(event: JQuery.Event): void {
    const {
      pageX = 0,
      pageY = 0,
    } = event;

    if (this.type === RANGE) {
      this.redirect(event);
      return;
    }

    const { orientation } = this.state;
    event.preventDefault();

    const center = getElementCenterPos(this.$tooltip, orientation);

    this.shiftFromCenter = orientation === HORIZONTAL ?
      pageX - center :
      pageY - center;

    $(document).on(
      'pointermove.tooltip',
      this.handleDocumentPointermove.bind(this)
    );

    $(document).on(
      'pointerup.tooltip',
      Tooltip.handleDocumentPointerup
    );
  }

  private handleDocumentPointermove(event: JQuery.Event): void {
    const {
      pageX = 0,
      pageY = 0,
    } = event;

    const position = this.state.orientation === HORIZONTAL ?
      pageX - this.shiftFromCenter :
      pageY - this.shiftFromCenter;

    this.handleTooltipPointermove?.(position, this.type);
  }
}

export default Tooltip;
