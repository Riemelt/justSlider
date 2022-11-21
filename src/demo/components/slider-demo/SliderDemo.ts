import { JustSlider, Options } from "../../../app/types";
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

    this.configurationPanel = new ConfigurationPanel(this.$component.find(`.js-${this.className}__configuration-panel`), {
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
      },
      toggleVertical: {
        ...options.configurationPanel.toggleVertical,
        handleToggleChange: this.handleToggleOrientationChange.bind(this),
      },
      toggleRange: {
        ...options.configurationPanel.toggleRange,
        handleToggleChange: this.handleToggleRangeChange.bind(this),
      },
      toggleBar: {
        ...options.configurationPanel.toggleBar,
        handleToggleChange: this.handleToggleProgressBarChange.bind(this),
      },
      toggleTooltip: {
        ...options.configurationPanel.toggleTooltip,
        handleToggleChange: this.handleToggleTooltipsChange.bind(this),
      },
      toggleForward: {
        ...options.configurationPanel.toggleForward,
        handleToggleChange: this.handleToggleDirectionChange.bind(this),
      },
      toggleScale: {
        ...options.configurationPanel.toggleScale,
        handleToggleChange: this.handleToggleScaleChange.bind(this),
      },
      scale: {
        inputDensity: {
          ...options.configurationPanel.scale.inputDensity,
          handleInputChange: this.handleInputScaleDensityChange.bind(this),
        },
        toggleType: {
          ...options.configurationPanel.scale.toggleType,
          handleToggleChange: this.handleToggleScaleTypeChange.bind(this),
        },
        toggleNumbers: {
          ...options.configurationPanel.scale.toggleNumbers,
          handleToggleChange: this.handleToggleScaleNumbersChange.bind(this),
        },
        toggleLines: {
          ...options.configurationPanel.scale.toggleLines,
          handleToggleChange: this.handleToggleScaleLinesChange.bind(this),
        }
      },
    });

    this.$slider = this.$component.find(`.js-${this.className}__slider`);
    this.slider  = this.$slider.justSlider({
      ...this.options.slider,
      onUpdate: this.handleSliderUpdate.bind(this),
    });
  }

  private handleSliderUpdate(options: Options) {
    this.configurationPanel.update(options);
  }

  private handleInputFromChange(value: number) {
    this.slider.updateHandle("from", value);
  }

  private handleInputToChange(value: number) {
    this.slider.updateHandle("to", value);
  }

  private handleInputMinChange(value: number) {
    this.slider.updateOptions({ min: value });
  }

  private handleInputMaxChange(value: number) {
    this.slider.updateOptions({ max: value });
  }

  private handleInputStepChange(value: number) {
    this.slider.updateOptions({ step: value });
  }

  private handleToggleOrientationChange(value: boolean) {
    const orientation = value ? "vertical" : "horizontal";
    this.slider.updateOptions({ orientation });
  }

  private handleToggleDirectionChange(value: boolean) {
    const direction = value ? "forward" : "backward";
    this.slider.updateOptions({ direction });
  }

  private handleToggleProgressBarChange(value: boolean) {
    this.slider.updateOptions({ progressBar: value });
  }

  private handleToggleRangeChange(value: boolean) {
    this.slider.updateOptions({ range: value });
  }

  private handleToggleTooltipsChange(value: boolean) {
    this.slider.updateOptions({ tooltips: value });
  }

  private handleInputScaleDensityChange(value: number) {
    this.slider.updateOptions({ scale: { density: value } });
  }

  private handleToggleScaleTypeChange(value: boolean) {
    const type = value ? "steps" : "set";
    this.slider.updateOptions({ scale: { type } });
  }

  private handleToggleScaleNumbersChange(value: boolean) {
    this.slider.updateOptions({ scale: { numbers: value } });
  }

  private handleToggleScaleLinesChange(value: boolean) {
    this.slider.updateOptions({ scale: { lines: value } });
  }

  private handleToggleScaleChange(value: boolean) {
    const scale = value ? this.options.slider.scale : null;
    this.slider.updateOptions({ scale });
  }
}

export default SliderDemo;