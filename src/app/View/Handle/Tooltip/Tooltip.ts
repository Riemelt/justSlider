class Tooltip {
  private $component: JQuery<HTMLElement>;

  constructor($parent: JQuery<HTMLElement>) {
    this.init($parent);
  }

  public update(value: number): void {
    this.$component.html(`${value}`);
  }

  public delete(): void {
    this.$component.remove();
  }

  private init($parent: JQuery<HTMLElement>): void {
    this.initHtml();

    $parent.append(this.$component);
  }

  private initHtml(): void {
    this.$component = $(`
      <div class="just-slider__tooltip">
      </div>
  `);
  }
}

export default Tooltip;