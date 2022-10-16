import {
  transform,
  convertViewPositionToModel,
} from "../utilities";

class Handle {
  private $point:  JQuery<HTMLElement>;
  private $handle: JQuery<HTMLElement>;
  private $parent: JQuery<HTMLElement>;
  private $slider: JQuery<HTMLElement>;
  private handleHandleMousemove: (position: number, type: HandleType) => void;
  private type: HandleType;
  private options: Options;

  constructor(handleOptions: HandleOptions) {
    this.init(handleOptions);
  }

  public setHandleMousemoveHandler(handler: (position: number, type: HandleType) => void) {
    this.handleHandleMousemove = handler;
  }

  public delete() {
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

  private updatePosition(transformOptions: TransformOptions) {
    const transformStyle = transform(transformOptions);
    this.$point.css("transform", transformStyle);
  }

  private init({$parent, $slider, type}: HandleOptions) {
    this.type    = type;
    this.$parent = $parent;
    this.$slider = $slider;

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

  private handleMousedown(event: Event) {
    event.preventDefault();
    this.$slider.removeClass("just-slider_animated");

    $(document).on("mousemove.handle", this.handleDocumentMousemove.bind(this));
    $(document).on("mouseup.handle", this.handleDocumentMouseup.bind(this));
  }

  private handleDocumentMousemove(event: MouseEvent) {
    const position = this.options.orientation === "horizontal" ? event.pageX : event.pageY;
    const { min, max, orientation, direction } = this.options;
    const convertedPosition = convertViewPositionToModel({
      position,
      min,
      max,
      orientation,
      direction,
      $context: this.$parent,
    });

    this.handleHandleMousemove?.(convertedPosition, this.type);
  }

  private handleDocumentMouseup() {
    $(document).off("mouseup.handle");
    $(document).off("mousemove.handle");

    this.$slider.addClass("just-slider_animated");
  }
}

export default Handle;