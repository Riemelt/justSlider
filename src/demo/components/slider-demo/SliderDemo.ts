import {
  JustSlider,
  State,
} from '../../../app/types';
import {
  BACKWARD,
  FORWARD,
  FROM,
  HORIZONTAL,
  TO,
  VERTICAL,
} from '../../../app/Model/constants';
import {
  SET,
  STEPS,
} from '../../../app/View/Scale/constants';
import ConfigurationPanel from '../configuration-panel';
import {
  SliderDemoOptions,
} from './types';

class SliderDemo {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private options: SliderDemoOptions;

  private configurationPanel?: ConfigurationPanel;
  private $slider?: JQuery<HTMLElement>;
  private slider?: JustSlider;

  constructor($parent: JQuery<HTMLElement>, options: SliderDemoOptions) {
    this.className = 'slider-demo';
    this.options = options;
    this.$component = $parent.find(`.js-${this.className}`);
    this.init(options);
  }

  private init(options: SliderDemoOptions): void {
    const panelClass = `.js-${this.className}__configuration-panel`;
    const $panel = this.$component.find(panelClass);

    this.configurationPanel = new ConfigurationPanel($panel, {
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
      inputPrecision: {
        ...options.configurationPanel.inputPrecision,
        handleInputChange: this.handleInputPrecisionChange.bind(this),
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
          ...options.configurationPanel.scale?.inputDensity,
          handleInputChange: this.handleInputScaleDensityChange.bind(this),
        },
        toggleType: {
          ...options.configurationPanel.scale?.toggleType,
          handleToggleChange: this.handleToggleScaleTypeChange.bind(this),
        },
        toggleNumbers: {
          ...options.configurationPanel.scale?.toggleNumbers,
          handleToggleChange: this.handleToggleScaleNumbersChange.bind(this),
        },
        toggleLines: {
          ...options.configurationPanel.scale?.toggleLines,
          handleToggleChange: this.handleToggleScaleLinesChange.bind(this),
        },
      },
    });

    this.$slider = this.$component.find(`.js-${this.className}__slider`);
    this.$slider.justSlider({
      ...this.options.slider,
      onUpdate: this.handleSliderUpdate.bind(this),
    });

    this.slider = this.$slider.data('just-slider');
  }

  private handleSliderUpdate(state: State): void {
    this.configurationPanel?.update(state);
  }

  private handleInputFromChange(value: number): void {
    this.slider?.update(FROM, value);
  }

  private handleInputToChange(value: number): void {
    this.slider?.update(TO, value);
  }

  private handleInputMinChange(value: number): void {
    this.slider?.updateOptions({ min: value });
  }

  private handleInputMaxChange(value: number): void {
    this.slider?.updateOptions({ max: value });
  }

  private handleInputStepChange(value: number): void {
    this.slider?.updateOptions({ step: value });
  }

  private handleInputPrecisionChange(value: number): void {
    this.slider?.updateOptions({ precision: value });
  }

  private handleToggleOrientationChange(value: boolean): void {
    const orientation = value ? VERTICAL : HORIZONTAL;
    this.slider?.updateOptions({ orientation });
  }

  private handleToggleDirectionChange(value: boolean): void {
    const direction = value ? FORWARD : BACKWARD;
    this.slider?.updateOptions({ direction });
  }

  private handleToggleProgressBarChange(value: boolean): void {
    this.slider?.updateOptions({ progressBar: value });
  }

  private handleToggleRangeChange(value: boolean): void {
    this.slider?.updateOptions({ range: value });
  }

  private handleToggleTooltipsChange(value: boolean): void {
    this.slider?.updateOptions({ tooltips: value });
  }

  private handleInputScaleDensityChange(value: number): void {
    this.slider?.updateOptions({ scale: { density: value } });
  }

  private handleToggleScaleTypeChange(value: boolean): void {
    const type = value ? STEPS : SET;
    this.slider?.updateOptions({ scale: { type } });
  }

  private handleToggleScaleNumbersChange(value: boolean): void {
    this.slider?.updateOptions({ scale: { numbers: value } });
  }

  private handleToggleScaleLinesChange(value: boolean): void {
    this.slider?.updateOptions({ scale: { lines: value } });
  }

  private handleToggleScaleChange(value: boolean): void {
    const scale = value ? this.options.slider.scale : null;
    if (scale !== undefined) {
      this.slider?.updateOptions({ scale });
    }
  }
}

export default SliderDemo;
