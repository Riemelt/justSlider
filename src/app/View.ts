class View {
  private options: Options;
  private $html: JQuery<HTMLElement>;
  private $justSlider: JQuery<HTMLElement>;

  constructor() {
    console.log("View created");
  }

  getHtml() {
    return this.$html;
  }

  init(options: Options) {
    this.options = options;
    this.initHtml();
  }

  initHtml() {
    this.$html = $(`
      <div class="just-slider"></div>
    `);
    this.$justSlider = this.$html.find(".just-slider");
  }

}

export default View;