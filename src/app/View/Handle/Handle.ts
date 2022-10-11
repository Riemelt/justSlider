class Handle {
  private $point: JQuery<HTMLElement>;
  private $handle: JQuery<HTMLElement>;
  private handleHandleMousemove: (position: number, type: HandleType) => void;
  private type: HandleType;

  static translate(value: number, range: number): number {
    return (100 - ((value * 100) / range)) * (-1);
  }

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
    const value = options[this.type];
    const { min, max } = options;
    const translate = Handle.translate(value, max - min);
    this.$point.css("transform", `translate(${translate}%)`);
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
    this.handleHandleMousemove?.(event.clientX, this.type);
  }

  private handleDocumentMouseup() {
    $(document).off("mouseup.handle");
    $(document).off("mousemove.handle");
  }
}

export default Handle;