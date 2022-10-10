class Handle {
  private $point: JQuery<HTMLElement>;
  private $handle: JQuery<HTMLElement>;
  private isActive: boolean;
  private handleHandleMousemove: (position: number, type: HandleType) => void;
  private type: HandleType;

  static translate(value: number, range: number): number {
    return (100 - ((value * 100) / range)) * (-1);
  }

  constructor($element: JQuery<HTMLElement>, type: HandleType) {
    this.init($element, type);
  }

  init($element: JQuery<HTMLElement>, type: HandleType) {
    this.type = type;
    this.$point = $element;
    this.$handle = this.$point.find(".just-slider__handle");
    this.isActive = false;
  }

  setHandlers() {
    this.$handle.on("mousedown.handle", this.handleMousedown.bind(this));
  }

  disableHandlers() {
    this.$handle.off(".handle");
  }

  handleMousedown(event: Event) {
    event.preventDefault();

    $(document).on("mousemove.handle", this.handleDocumentMousemove.bind(this));
    $(document).on("mouseup.handle", this.handleDocumentMouseup.bind(this));
  }

  handleDocumentMousemove(event: MouseEvent) {
    this.handleHandleMousemove?.(event.clientX, this.type);
  }

  handleDocumentMouseup() {
    $(document).off("mouseup.handle");
    $(document).off("mousemove.handle");
  }

  setHandleMousemoveHandler(handler: (position: number, type: HandleType) => void) {
    this.handleHandleMousemove = handler;
  }

  start() {
    this.isActive = true;
    this.$point.addClass("just-slider__point_active");
    this.setHandlers();
  }

  end() {
    this.isActive = false;
    this.$point.removeClass("just-slider__point_active");
    this.disableHandlers();
  }

  update(options: Options) {
    if (this.isActive) {
      const value = options[this.type];
      const { min, max } = options;
      const translate = Handle.translate(value, max - min);
      this.$point.css("transform", `translate(${translate}%)`);
    }
  }
}

export default Handle;