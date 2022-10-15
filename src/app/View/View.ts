import Handle from "./Handle/Handle";

class View {
  private options: Options;
  private $html: JQuery<HTMLElement>;
  private $justSlider: JQuery<HTMLElement>;
  private handleHandleMousemove: (position: number, type: HandleType) => void;

  private handles: {
    from: Handle,
    to: Handle,
  };

  constructor() {
    console.log("View created");
  }

  public getHtml() {
    return this.$html;
  }

  public init(options: Options) {
    this.options = options;
    this.handles = { from: undefined, to: undefined };
    this.initHtml();

    const { orientation } = options;
    if (orientation === "vertical") {
      this.toggleOrientation();
    }
  }

  public toggleOrientation() {
    this.$html.toggleClass("just-slider_vertical");
  }

  public initComponents() {
    this.initHandleFrom();
    this.initHandleTo();
  }

  public updateHandle(options: Options, type: HandleType) {
    this.handles[type].update(options);
  }

  public deleteHandle(type: HandleType) {
    this.handles[type]?.delete();
    delete this.handles[type];
  }

  public addCreateHandleHandlers(handler: (value: number, type: HandleType) => void) {
    this.handleHandleMousemove = (position, type) => {
      const { min, max, orientation, direction } = this.options;
      const converted = this.convertViewHandleToModel(position, min, max, orientation, direction);

      handler(converted, type);
    }
    
    this.handles.from?.setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
    this.handles.to?.setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
  }

  private initHtml() {
    this.$html = $(`
      <div class="just-slider">
        <div class="just-slider__main">
        </div>
      </div>
    `);

    this.$justSlider = this.$html.find(".just-slider__main");
  }

  private initHandleFrom() {
    this.handles.from = new Handle(this.$justSlider, "from");
    this.handles.from.update(this.options);
  }

  private initHandleTo() {
    const { isRange } = this.options;

    if (isRange) {
      this.handles.to = new Handle(this.$justSlider, "to");
      this.handles.to.update(this.options);
    }
  }

  private convertViewHandleToModel(position: number, min: number, max: number, orientation: Orientation, direction: Direction): number {
    const sliderLength = orientation === "horizontal" ? this.$justSlider.width() : this.$justSlider.height();
    const shift = orientation === "horizontal" ? this.$justSlider.position().left : this.$justSlider.position().top;

    const ratio = (max - min) / sliderLength;
    const realPosition = position - shift;
    const converted = realPosition * ratio + min;

    if ((direction === "forward" && orientation === "horizontal") || (direction === "backward" && orientation === "vertical")) {
      return converted;
    }

    return min + max - converted;
  }
}

export default View;