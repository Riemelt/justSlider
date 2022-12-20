import {
  SLIDER_CLICK_DISABLE,
  SLIDER_CLICK_ENABLE,
} from '../../EventManager/constants';
import EventManager from '../../EventManager/EventManager';
import {
  FORWARD,
  FROM,
  HORIZONTAL,
  TO,
} from '../../Model/constants';
import {
  HandleType,
} from '../../Model/types';
import {
  Direction,
  State,
  Orientation,
} from '../../types';
import {
  getTransformStyles,
} from '../utilities/utilities';
import Tooltip from './Tooltip/Tooltip';
import {
  HandleOptions,
} from './types';

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';

class Handle {
  private eventManager: EventManager;
  private $component: JQuery<HTMLElement>;
  private $handle: JQuery<HTMLElement>;
  private shiftFromCenter = 0;

  private handleHandlePointermove?: (
    position: number,
    type: HandleType,
    isConverted?: boolean
  ) => void;

  private type: HandleType = FROM;
  private state: State;

  private tooltip?: Tooltip;

  static initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__point">
        <div class="just-slider__handle" tabindex="0">
        </div>
      </div>
    `);
  }

  static moveByStep(options: {
    value: number,
    step: number,
    direction: Direction,
  }): number {
    const { value, step, direction } = options;
    const sign = direction === FORWARD ? 1 : -1;
    return value + (sign * step);
  }

  constructor(handleOptions: HandleOptions) {
    this.eventManager = handleOptions.eventManager;
    this.$component = Handle.initHtml();
    this.$handle = this.$component.find('.just-slider__handle');
    this.state = handleOptions.state;
    this.init(handleOptions);
  }

  public getHandleHTML(): JQuery<HTMLElement> {
    return this.$handle;
  }

  public setHandlePointermoveHandler(handler: (
    position: number,
    type: HandleType
  ) => void): void {
    this.handleHandlePointermove = handler;
  }

  public delete(): void {
    this.deleteHandlers();
    this.$component.remove();
  }

  public update(state: State): void {
    this.state = state;
    const value = state[this.type];
    const { min, max, orientation, direction } = state;

    this.updatePosition({
      min,
      max,
      orientation,
      direction,
      shift: value,
    });

    this.updateFocus(value, min, max, this.type);
    this.updateTooltip(state);
  }

  public updateTooltip(state: State): void {
    const { tooltips, precision } = state;
    const value = state[this.type];

    if (tooltips) {
      if (!this.tooltip) {
        this.tooltip = new Tooltip(this.$handle);
      }

      this.tooltip.update(value, precision);
      return;
    }

    if (!this.tooltip) return;

    this.deleteTooltip();
  }

  private deleteTooltip(): void {
    this.tooltip?.delete();
    delete this.tooltip;
  }

  private updateFocus(
    value: number,
    min: number,
    max: number,
    type: HandleType
  ): void {
    if (type !== TO) {
      return;
    }

    const medium = ((max - min) / 2) + min;

    if (value < medium) {
      this.$component.addClass('just-slider__point_focused');
      this.$component.removeClass('just-slider__point_unfocused');
    } else {
      this.$component.removeClass('just-slider__point_focused');
      this.$component.addClass('just-slider__point_unfocused');
    }
  }

  private updatePosition(options: {
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

  private init({ $parent, type }: HandleOptions): void {
    this.type = type;
    this.setHandlers();
    $parent.append(this.$component);
  }

  private setHandlers(): void {
    this.$handle.on('pointerdown.handle', this.handlePointerdown.bind(this));
    this.$handle.on('keydown.handle', this.handleKeydown.bind(this));
  }

  private deleteHandlers(): void {
    this.$handle.off('pointerdown.handle');
    this.$handle.off('keydown.handle');
  }

  private handleKeydown(event: JQuery.Event): void {
    const { key } = event;
    const value = this.state[this.type];
    const { step, direction } = this.state;

    if (key === ARROW_RIGHT || key === ARROW_UP) {
      event.preventDefault();
      const newValue = Handle.moveByStep({ value, direction, step });
      this.handleHandlePointermove?.(newValue, this.type, true);
      return;
    }

    if (key === ARROW_LEFT || key === ARROW_DOWN) {
      event.preventDefault();
      const newValue = Handle.moveByStep({ value, direction, step: -step });
      this.handleHandlePointermove?.(newValue, this.type, true);
      return;
    }
  }

  private handlePointerdown(event: JQuery.Event): void {
    const {
      pageX = 0,
      pageY = 0,
    } = event;

    event.preventDefault();
    this.eventManager.dispatchEvent(SLIDER_CLICK_DISABLE);

    let offset: number;

    if (this.state.orientation === HORIZONTAL) {
      offset = this.$handle.offset()?.left ?? 0;
    } else {
      offset = this.$handle.offset()?.top ?? 0;
    }

    const length = this.$handle.outerWidth() ?? 0;

    const center = offset + (length / 2);
    this.shiftFromCenter = this.state.orientation === HORIZONTAL ?
      pageX - center :
      pageY - center;

    $(document).on(
      'pointermove.handle',
      this.handleDocumentPointermove.bind(this)
    );

    $(document).on(
      'pointerup.handle',
      this.handleDocumentPointerup.bind(this)
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

    this.handleHandlePointermove?.(position, this.type);
  }

  private handleDocumentPointerup(): void {
    $(document).off('pointerup.handle');
    $(document).off('pointermove.handle');

    this.eventManager.dispatchEvent(SLIDER_CLICK_ENABLE);
  }
}

export default Handle;
