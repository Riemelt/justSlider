class Handle {
  private $point: JQuery<HTMLElement>;
  private $handle: JQuery<HTMLElement>;
  private isActive: boolean;
  private handleHandleMousemove: (event: Event) => void;

  constructor($element: JQuery<HTMLElement>, options: HandleOptions) {
    this.init($element, options);
  }

  init($element: JQuery<HTMLElement>, options: HandleOptions) {
    const { handleHandleMousemove } = options;
    this.handleHandleMousemove = handleHandleMousemove;
    this.$point = $element;
    this.$handle = this.$point.find(".just-slider__handle");
    this.isActive = false;
  }

  setHandlers() {
    this.$handle.on("mousemove.handle", this.handleMousemove.bind(this));
  }

  handleMousemove(event: Event) {
    this.handleHandleMousemove?.(event);
  }

  start() {
    this.isActive = true;
    this.$point.addClass("just-slider__point_active");
  }

  end() {
    this.isActive = false;
    this.$point.removeClass("just-slider__point_active");
  }

  update(options: Options) {
    if (this.isActive) {
      //to do
    }
  }
}

export default Handle;