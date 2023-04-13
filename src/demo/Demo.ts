import SliderDemo from './components/slider-demo/SliderDemo';
import { DemoOptions, Demos } from './types';

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
    const demos: Array<keyof Demos> = [
      'primary',
      'secondary',
      'tertiary',
      'quaternary',
    ];

    demos.forEach((demo) => {
      new SliderDemo(
        this.$component.find(`.js-${this.className}__slider-demo-${demo}`),
        this.options.demos[demo]
      );
    });
  }
}

export default Demo;
