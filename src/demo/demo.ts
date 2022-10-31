import "./styles/demo.scss";

import SliderDemo from "./components/slider-demo";
import { DemoOptions } from "./types";

class Demo {
  private className: string;
  private options: DemoOptions;
  private $component: JQuery<HTMLElement>;
  private $sliderDemos: JQuery<HTMLElement>;

  constructor($element: JQuery<HTMLElement>, options: DemoOptions) {
    this.className = "demo";
    this.init($element, options);
  }

  private init($element: JQuery<HTMLElement>, options: DemoOptions) {
    this.$component = $element;
    this.options = options;
    this.$sliderDemos = this.$component.find(`.js-${this.className}__slider-demo`);
    this.$sliderDemos.each(this.initSliderDemo.bind(this));
  }

  private initSliderDemo(index: number, element: HTMLElement) {
    const $element = $(element);
    new SliderDemo($element, this.options.demos[index]);
  }
}

export default Demo;