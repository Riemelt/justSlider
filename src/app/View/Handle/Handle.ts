import EventManager from "../../EventManager/EventManager";
import { Direction, Options, Orientation } from "../../types";

import {
  transform,
  convertViewPositionToModel,
} from "../utilities";

import Tooltip from "./Tooltip/Tooltip";
import { HandleOptions } from "./types";

class Handle {
  private eventManager: EventManager;
  private $point:       JQuery<HTMLElement>;
  private $handle:      JQuery<HTMLElement>;
  private $parent:      JQuery<HTMLElement>;

  private handleHandleMousemove: (position: number, type: HandleType) => void;

  private type: HandleType;
  private options: Options;

  private tooltip: Tooltip;

  constructor(handleOptions: HandleOptions) {
    this.eventManager = handleOptions.eventManager;
    this.init(handleOptions);
  }

  public getHandleHTML(): JQuery<HTMLElement> {
    return this.$handle;
  }

  public setHandleMousemoveHandler(handler: (position: number, type: HandleType) => void) {
    this.handleHandleMousemove = handler;
  }

  public delete() {
    this.deleteHandlers();
    this.$point.remove();
  }

  public update(options: Options) {
    this.options = options;
    const value = options[this.type];
    const { min, max, orientation, direction } = options;

    this.updatePosition({
      min,
      max,
      orientation,
      direction,
      shift: value,
    });

    this.updateFocus(value, min, max, this.type);
    this.updateTooltip(options);
  }

  public updateTooltip(options: Options) {
    const { tooltips } = options;
    const value = options[this.type];

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

  private deleteTooltip() {
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
  }) {
    const transformStyle = transform(options);
    this.$point.css("transform", transformStyle);
  }

  private init({$parent, type}: HandleOptions) {
    this.type    = type;
    this.$parent = $parent;

    this.initHtml();
    this.$handle = this.$point.find(".just-slider__handle");

    this.setHandlers();
    $parent.append(this.$point);
  }

  private initHtml() {
    this.$point = $(`
      <div class="just-slider__point">
        <div class="just-slider__handle">
        </div>
      </div>
    `);
  }

  private setHandlers() {
    this.$handle.on("mousedown.handle", this.handleMousedown.bind(this));
  }

  private deleteHandlers() {
    this.$handle.off("mousedown.handle");
  }

  private handleMousedown(event: MouseEvent) {
    event.preventDefault();
    this.eventManager.dispatchEvent("SliderClickDisable");

    const offset = this.options.orientation === "horizontal" ? this.$handle.offset().left : this.$handle.offset().top;
    const length = this.options.orientation === "horizontal" ? this.$handle.outerWidth() : this.$handle.outerHeight();

    const center = offset + (length / 2);
    const shiftFromCenter  = this.options.orientation === "horizontal" ? event.pageX - center : event.pageY - center;

    $(document).on("mousemove.handle", handleDocumentMousemove.bind(this));
    $(document).on("mouseup.handle", handleDocumentMouseup.bind(this));

    function handleDocumentMousemove(event: MouseEvent) {
      const position = this.options.orientation === "horizontal" ? event.pageX - shiftFromCenter : event.pageY - shiftFromCenter;
  
      const { min, max, orientation, direction } = this.options;

      const length = orientation === "horizontal" ? this.$parent.width() : this.$parent.height();
      const shift = orientation === "horizontal" ? this.$parent.offset().left : this.$parent.offset().top;

      const convertedPosition = convertViewPositionToModel({
        position,
        min,
        max,
        orientation,
        direction,
        length,
        shift,
      });
  
      this.handleHandleMousemove?.(convertedPosition, this.type);
    }

    function handleDocumentMouseup() {
      $(document).off("mouseup.handle");
      $(document).off("mousemove.handle");

      this.eventManager.dispatchEvent("SliderClickEnable");
    }
  }
}

export default Handle;