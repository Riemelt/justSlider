import { FORWARD, FROM, HORIZONTAL } from '../../Model/constants';
import { HandleType } from '../../Model/types';
import { Direction, State, Orientation } from '../../types';
import {
  getElementCenterPos,
  getTransformStyles,
} from '../../utilities/utilities';
import { HandleOptions } from './types';

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';

class Handle {
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

  static $initHtml(): JQuery<HTMLElement> {
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

  static handleDocumentPointerup(): void {
    $(document).off('pointerup.handle');
    $(document).off('pointermove.handle');
  }

  constructor(handleOptions: HandleOptions) {
    this.$component = Handle.$initHtml();
    this.$handle = this.$component.find('.just-slider__handle');
    this.state = handleOptions.state;
    this.init(handleOptions);
  }

  public $getHtml(): JQuery<HTMLElement> {
    return this.$handle;
  }

  public setHandlePointermoveHandler(handler: (
    position: number,
    type: HandleType
  ) => void): void {
    this.handleHandlePointermove = handler;
  }

  public setType(type: HandleType): void {
    this.type = type;
  }

  public delete(): void {
    this.deleteHandlers();
    this.$component.remove();
  }

  public update(state: State): void {
    const value = state[this.type];
    const { min, max, orientation, direction } = state;

    this.updatePosition({
      min,
      max,
      orientation,
      direction,
      shift: value,
    });
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

    const move = (sign: 1 | -1) => {
      event.preventDefault();
      const newValue = Handle.moveByStep({
        value,
        direction,
        step: step * sign,
      });
      this.handleHandlePointermove?.(newValue, this.type, true);
    };

    if (key === ARROW_RIGHT || key === ARROW_UP) {
      move(1);
      return;
    }

    if (key === ARROW_LEFT || key === ARROW_DOWN) {
      move(-1);
      return;
    }
  }

  private handlePointerdown(event: JQuery.Event): void {
    const {
      pageX = 0,
      pageY = 0,
    } = event;
    const { orientation } = this.state;
    event.preventDefault();

    const center = getElementCenterPos(this.$handle, orientation);

    this.shiftFromCenter = orientation === HORIZONTAL ?
      pageX - center :
      pageY - center;

    $(document).on(
      'pointermove.handle',
      this.handleDocumentPointermove.bind(this)
    );

    $(document).on(
      'pointerup.handle',
      Handle.handleDocumentPointerup
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
}

export default Handle;
