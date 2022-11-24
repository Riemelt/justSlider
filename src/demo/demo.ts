import "./styles/demo.scss";

import SliderDemo from "./components/slider-demo";
import { DemoOptions } from "./types";

class Demo {
  private className: string;
  private options: DemoOptions;
  private $component: JQuery<HTMLElement>;

  constructor($element: JQuery<HTMLElement>, options: DemoOptions) {
    this.className = "demo";
    this.init($element, options);
  }

  private init($element: JQuery<HTMLElement>, options: DemoOptions) {
    this.$component = $element;
    this.options = options;

    const $sliderDemoPrimary = this.$component.find(`.js-${this.className}__slider-demo-primary`);
    new SliderDemo($sliderDemoPrimary, this.options.demos.primary);

    const $sliderDemoSecondary = this.$component.find(`.js-${this.className}__slider-demo-secondary`);
    new SliderDemo($sliderDemoSecondary, this.options.demos.secondary);

    const $sliderDemoTertiary = this.$component.find(`.js-${this.className}__slider-demo-tertiary`);
    new SliderDemo($sliderDemoTertiary, this.options.demos.tertiary);

    const $sliderDemoQuaternary = this.$component.find(`.js-${this.className}__slider-demo-quaternary`);
    new SliderDemo($sliderDemoQuaternary, this.options.demos.quaternary);
  }
}

export default Demo;