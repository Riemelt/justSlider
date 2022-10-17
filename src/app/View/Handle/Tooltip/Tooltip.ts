class Tooltip {
  private $component: JQuery<HTMLElement>;

  constructor($parent: JQuery<HTMLElement>) {
    this.init($parent);
  }

  public update(value: number) {
    this.$component.html(`${value}`);
  }

  public delete() {
    this.$component.remove();
  }

  private init($parent: JQuery<HTMLElement>) {
    this.initHtml();

    $parent.append(this.$component);
  }

  private initHtml() {
    this.$component = $(`
      <div class="just-slider__tooltip">
      </div>
  `);
  }
}

export default Tooltip;