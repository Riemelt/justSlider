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

    this.$slider = this.$component.find(`.js-${this.className}__slider`);
    this.slider = this.$slider.justSlider(this.options.slider);

    new ConfigurationPanel(this.$component.find(`.js-${this.className}__configuration-panel`), {
      ...options.configurationPanel,
      inputFrom: {
        ...options.configurationPanel.inputFrom,
        handleInputChange: this.handleInputFromChange.bind(this),
      },
      inputTo: {
        ...options.configurationPanel.inputFrom,
        handleInputChange: this.handleInputToChange.bind(this),
      },
      inputMin: {
        ...options.configurationPanel.inputMin,
        handleInputChange: this.handleInputMinChange.bind(this),
      },
      inputMax: {
        ...options.configurationPanel.inputMax,
        handleInputChange: this.handleInputMaxChange.bind(this),
      },
      inputStep: {
        ...options.configurationPanel.inputStep,
        handleInputChange: this.handleInputStepChange.bind(this),
      }
    });
  }

  private handleInputFromChange(value: number) {
    this.slider.updateHandle("from", value);
  }

  private handleInputToChange(value: number) {
    this.slider.updateHandle("to", value);
  }

  private handleInputMinChange(value: number) {
    this.slider.updateMin(value);
  }

  private handleInputMaxChange(value: number) {
    this.slider.updateMax(value);
  }

  private handleInputStepChange(value: number) {
    this.slider.updateStep(value);
  }
}

export default SliderDemo;