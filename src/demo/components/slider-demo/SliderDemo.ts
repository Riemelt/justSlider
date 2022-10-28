import { JustSlider }        from "../../../app/types";
import { SliderDemoOptions } from "./types";
import ConfigurationPanel    from "../configuration-panel";

class SliderDemo {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private options: SliderDemoOptions;

  private configurationPanel: ConfigurationPanel;
  private $slider: JQuery<HTMLElement>;
  private slider: JustSlider;

  constructor($parent: JQuery<HTMLElement>, options: SliderDemoOptions) {
    this.className = "slider-demo";
    this.init($parent, options);
  }

  private init($parent: JQuery<HTMLElement>, options: SliderDemoOptions) {
    this.options = options;
    this.$component = $parent.find(`.js-${this.className}`);
    new ConfigurationPanel(this.$component.find(`.js-${this.className}__configuration-panel`));
    this.$slider = this.$component.find(`.js-${this.className}__slider`);
    this.slider = this.$slider.justSlider(this.options.slider);
  }
}

export default SliderDemo;