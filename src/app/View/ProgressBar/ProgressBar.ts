class ProgressBar {
  private $component: JQuery<HTMLElement>;
  private options: Options;

  constructor($parent: JQuery<HTMLElement>) {
    this.init($parent);
  }

  public update(options: Options) {
    this.options = options;
  }

  private init($parent: JQuery<HTMLElement>) {
    this.initHtml();

    $parent.append(this.$component);
  }

  private initHtml() {
    this.$component = $(`
      <div class="just-slider__progress-bar">
      </div>
    `);
  }
}

export default ProgressBar;