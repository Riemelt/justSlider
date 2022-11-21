import EventManager from "../../EventManager/EventManager";
import {
  Direction,
  State,
  Orientation,
} from "../../types";

import {
  getTransformStyles,
} from "../utilities";

import Tooltip from "./Tooltip/Tooltip";
import { HandleOptions } from "./types";

class Handle {
  private eventManager:    EventManager;
  private $point:          JQuery<HTMLElement>;
  private $handle:         JQuery<HTMLElement>;
  private shiftFromCenter: number;

  private handleHandleMousemove: (position: number, type: HandleType) => void;

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

  public setHandleMousemoveHandler(handler: (position: number, type: HandleType) => void): void {
    this.handleHandleMousemove = handler;
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
    const { tooltips } = state;
    const value = state[this.type];

    if (tooltips) {
      if (!this.tooltip) {
        this.tooltip = new Tooltip(this.$handle);
      }

      this.tooltip.update(value);
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
        <div class="just-slider__handle">
        </div>
      </div>
    `);
  }

  private setHandlers(): void {
    this.$handle.on("mousedown.handle", this.handleMousedown.bind(this));
  }

  private deleteHandlers(): void {
    this.$handle.off("mousedown.handle");
  }

  private handleMousedown(event: MouseEvent): void {
    event.preventDefault();
    this.eventManager.dispatchEvent("SliderClickDisable");

    const offset = this.state.orientation === "horizontal" ? this.$handle.offset().left : this.$handle.offset().top;
    const length = this.state.orientation === "horizontal" ? this.$handle.outerWidth() : this.$handle.outerHeight();

    const center         = offset + (length / 2);
    this.shiftFromCenter = this.state.orientation === "horizontal" ? event.pageX - center : event.pageY - center;

    $(document).on("mousemove.handle", this.handleDocumentMousemove.bind(this));
    $(document).on("mouseup.handle", this.handleDocumentMouseup.bind(this));
  }
  
  private handleDocumentMousemove(event: MouseEvent): void {
    const position = this.state.orientation === "horizontal" ? event.pageX - this.shiftFromCenter : event.pageY - this.shiftFromCenter;
    this.handleHandleMousemove?.(position, this.type);
  }

  private handleDocumentMouseup(): void {
    $(document).off("mouseup.handle");
    $(document).off("mousemove.handle");

    this.eventManager.dispatchEvent("SliderClickEnable");
  }
}

export default Handle;