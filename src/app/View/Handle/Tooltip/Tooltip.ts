import {
  getValueBasedOnPrecision,
} from '../../utilities/utilities';

class Tooltip {
  private $component: JQuery<HTMLElement>;

  static initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider__tooltip">
      </div>
    `);
  }

  constructor($parent: JQuery<HTMLElement>) {
    this.$component = Tooltip.initHtml();
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
}

export default Tooltip;
