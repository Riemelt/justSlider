import Handle from "./Handle/Handle";

class View {
  private options: Options;
  private $html: JQuery<HTMLElement>;
  private $justSlider: JQuery<HTMLElement>;

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
    this.$justSlider = this.$html.find(".just-slider");
  }

  initComponents() {
    const $handleElement = this.$html.find(".just-slider__point");
    this.handle = new Handle($handleElement, {
      handleHandleMousemove: this.handleHandleMousemove.bind(this),
    });
  }

  startComponents() {
    this.handle.start();
  }

  handleHandleMousemove(event: Event) {
    //to do
  }

}

export default View;