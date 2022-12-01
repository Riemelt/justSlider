import {
  getValueBasedOnPrecision,
} from "../../utilities/utilities";

class Tooltip {
  private $component: JQuery<HTMLElement>;

  constructor($parent: JQuery<HTMLElement>) {
    this.$component = this.initHtml();
    this.init($parent);
  }

  public update(value: number, precision: number): void {
    const converted = getValueBasedOnPrecision(value, precision);
    this.$component.html(converted);
  }

  public delete(): void {
    this.$component.remove();
  }

  private init($parent: JQuery<HTMLElement>): void {
    $parent.append(this.$component);
  }

  private initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__tooltip">
      </div>
    `);
  }
}

export default Tooltip;