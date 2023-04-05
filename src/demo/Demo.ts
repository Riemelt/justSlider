import SliderDemo from './components/slider-demo/SliderDemo';
import { DemoOptions } from './types';

class Demo {
  private className: string;
  private options: DemoOptions;
  private $component: JQuery<HTMLElement>;

  constructor($element: JQuery<HTMLElement>, options: DemoOptions) {
    this.className = 'demo';
    this.$component = $element;
    this.options = options;
    this.init();
  }

  private init() {
    new SliderDemo(
      this.$component.find(`.js-${this.className}__slider-demo-primary`),
      this.options.demos.primary
    );

    new SliderDemo(
      this.$component.find(`.js-${this.className}__slider-demo-secondary`),
      this.options.demos.secondary
    );

    new SliderDemo(
      this.$component.find(`.js-${this.className}__slider-demo-tertiary`),
      this.options.demos.tertiary
    );

    new SliderDemo(
      this.$component.find(`.js-${this.className}__slider-demo-quaternary`),
      this.options.demos.quaternary
    );
  }
}

export default Demo;
