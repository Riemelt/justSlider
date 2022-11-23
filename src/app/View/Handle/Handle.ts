import EventManager from "../../EventManager/EventManager";
import {
  Direction,
  State,
  Orientation,
} from "../../types";

import {
  getTransformStyles,
} from "../utilities/utilities";

import Tooltip from "./Tooltip/Tooltip";
import { HandleOptions } from "./types";

class Handle {
  private eventManager:    EventManager;
  private $point:          JQuery<HTMLElement>;
  private $handle:         JQuery<HTMLElement>;
  private shiftFromCenter: number;

  private handleHandlePointermove: (position: number, type: HandleType, isConverted?: boolean) => void;

  private type:  HandleType;
  private state: State;

  private tooltip: Tooltip;

  constructor(handleOptions: HandleOptions) {
    this.eventManager = handleOptions.eventManager;
    this.init(handleOptions);
  }

  public getHandleHTML(): JQuery<HTMLElement> {
    return this.$handle;
  }

  public setHandlePointermoveHandler(handler: (position: number, type: HandleType) => void): void {
    this.handleHandlePointermove = handler;
  }

  public delete(): void {
    this.deleteHandlers();
    this.$point.remove();
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

  private updateFocus(value: number, min: number, max: number, type: HandleType): void {
    if (type !== "to") {
      return;
    }

    const medium = ((max - min) / 2) + min;

    if (value < medium) {
      this.$point.addClass("just-slider__point_focused");
      this.$point.removeClass("just-slider__point_unfocused");
    } else {
      this.$point.removeClass("just-slider__point_focused");
      this.$point.addClass("just-slider__point_unfocused");
    }
  }

  private updatePosition(options: {
    shift:        number,
    min:          number,
    max:          number,
    orientation:  Orientation,
    direction:    Direction,
    scale?:       number,
  }): void {
    const { property, style } = getTransformStyles(options);
    this.$point.css(property, style);
  }

  private init({ $parent, type }: HandleOptions): void {
    this.type = type;

    this.initHtml();
    this.$handle = this.$point.find(".just-slider__handle");

    this.setHandlers();
    $parent.append(this.$point);
  }

  private initHtml(): void {
    this.$point = $(`
      <div class="just-slider__point">
        <div class="just-slider__handle" tabindex="0">
        </div>
      </div>
    `);
  }

  private setHandlers(): void {
    this.$handle.on("pointerdown.handle", this.handlePointerdown.bind(this));
    this.$handle.on("keydown.handle", this.handleKeydown.bind(this));
  }

  private deleteHandlers(): void {
    this.$handle.off("pointerdown.handle");
    this.$handle.off("keydown.handle");
  }

  private handleKeydown(event: KeyboardEvent): void {
    const { key }             = event;
    const value               = this.state[this.type];
    const { step, direction } = this.state;

    if (key === "ArrowRight" || key === "ArrowUp") {
      event.preventDefault();
      const newValue = this.moveByStep({ value, direction, step });
      this.handleHandlePointermove?.(newValue, this.type, true);
      return;
    }

    if (key === "ArrowLeft" || key === "ArrowDown") {
      event.preventDefault();
      const newValue = this.moveByStep({ value, direction, step: -step });
      this.handleHandlePointermove?.(newValue, this.type, true);
      return;
    }
  }

  private moveByStep(options: {
    value:     number,
    step:      number,
    direction: Direction,
  }): number {
    const { value, step, direction } = options;
    const sign = direction === "forward" ? 1 : -1;
    return value + sign * step;
  }

  private handlePointerdown(event: PointerEvent): void {
    event.preventDefault();
    this.eventManager.dispatchEvent("SliderClickDisable");

    const offset = this.state.orientation === "horizontal" ? this.$handle.offset().left : this.$handle.offset().top;
    const length = this.$handle.outerWidth();

    const center         = offset + (length / 2);
    this.shiftFromCenter = this.state.orientation === "horizontal" ? event.pageX - center : event.pageY - center;

    $(document).on("pointermove.handle", this.handleDocumentPointermove.bind(this));
    $(document).on("pointerup.handle", this.handleDocumentPointerup.bind(this));
  }
  
  private handleDocumentPointermove(event: PointerEvent): void {
    const position = this.state.orientation === "horizontal" ? event.pageX - this.shiftFromCenter : event.pageY - this.shiftFromCenter;
    this.handleHandlePointermove?.(position, this.type);
  }

  private handleDocumentPointerup(): void {
    $(document).off("pointerup.handle");
    $(document).off("pointermove.handle");

    this.eventManager.dispatchEvent("SliderClickEnable");
  }
}

export default Handle;