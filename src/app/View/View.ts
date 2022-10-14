import Handle from "./Handle/Handle";

class View {
  private options: Options;
  private $html: JQuery<HTMLElement>;
  private $justSlider: JQuery<HTMLElement>;
  private handleHandleMousemove: (position: number, type: HandleType) => void;

  private handle: Handle;

  constructor() {
    console.log("View created");
  }

  public getHtml() {
    return this.$html;
  }

  public init(options: Options) {
    this.options = options;
  }

  public initHtml() {
    this.$html = $(`
      <div class="just-slider">
        <div class="just-slider__main">
        </div>
      </div>
    `);

    this.$justSlider = this.$html.find(".just-slider__main");
  }

  public initComponents() {
    this.initHandle();
  }

  public initHandle() {
    this.handle = new Handle(this.$justSlider, "to");
    this.handle.update(this.options);
  }

  public updateHandle(options: Options) {
    this.handle?.update(options);
  }

  public deleteHandle() {
    this.handle?.delete();
    delete this.handle;
  }

  public addCreateHandleHandler(handler: (value: number, type: HandleType) => void) {
    this.handleHandleMousemove = (position, type) => {
      const { min, max } = this.options;
      const converted = this.convertViewHandleToModel(position, max - min);

      handler(converted, type);
    }
    
    this.handle.setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
  }

  private convertViewHandleToModel(position: number, range: number): number {
    const ratio = range / this.$justSlider.width();
    const realPosition = position - this.$justSlider.position().left;
    const converted = realPosition * ratio;

    return converted;
  }
}

export default View;