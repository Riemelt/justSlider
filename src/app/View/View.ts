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

  getHtml() {
    return this.$html;
  }

  init(options: Options) {
    this.options = options;
  }

  initHtml() {
    this.$html = $(`
      <div class="just-slider">
        <div class="just-slider__main">
          <div class="just-slider__point">
            <div class="just-slider__handle">
            </div>
          </div>
        </div>
      </div>
    `);

    this.$justSlider = this.$html.find(".just-slider__main");
  }

  initComponents() {
    const $handleElement = this.$html.find(".just-slider__point");
    this.handle = new Handle($handleElement, "to");
  }

  startComponents() {
    this.handle.start();
  }

  addCreateHandleHandler(handler: (value: number, type: HandleType) => void) {
    this.handleHandleMousemove = (position, type) => {
      const { min, max } = this.options;
      const converted = this.convertViewHandleToModel(position, max - min);

      handler(converted, type);
    }
    
    this.handle.setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
  }

  convertViewHandleToModel(position: number, range: number): number {
    const ratio = range / this.$justSlider.width();
    const realPosition = position - this.$justSlider.position().left;
    const converted = realPosition * ratio;

    return converted;
  }

  updateHandle(options: Options) {
    this.handle.update(options);
  }

}

export default View;