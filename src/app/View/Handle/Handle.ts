import { translate } from "../../utilities";

class Handle {
  private $point: JQuery<HTMLElement>;
  private $handle: JQuery<HTMLElement>;
  private handleHandleMousemove: (position: number, type: HandleType) => void;
  private type: HandleType;
  private options: Options;

  constructor($parent: JQuery<HTMLElement>, type: HandleType) {
    this.init($parent, type);
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

    this.updatePosition(value, min, max, orientation, direction);
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

  private updatePosition(shift: number, min: number, max: number, orientation: Orientation, direction: Direction) {
    const translateStyle = translate(shift, min, max, orientation, direction);
    this.$point.css("transform", translateStyle);
  }

  private init($parent: JQuery<HTMLElement>, type: HandleType) {
    this.type = type;

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

    $(document).on("mousemove.handle", this.handleDocumentMousemove.bind(this));
    $(document).on("mouseup.handle", this.handleDocumentMouseup.bind(this));
  }

  private handleDocumentMousemove(event: MouseEvent) {
    const position = this.options.orientation === "horizontal" ? event.pageX : event.pageY;
    this.handleHandleMousemove?.(position, this.type);
  }

  private handleDocumentMouseup() {
    $(document).off("mouseup.handle");
    $(document).off("mousemove.handle");
  }
}

export default Handle;