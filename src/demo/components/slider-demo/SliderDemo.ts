import {
  JustSlider,
  JustSliderOptions,
  State,
} from '../../../app/types';
import {
  BACKWARD,
  DENSITY,
  DIRECTION,
  FORWARD,
  FROM,
  HORIZONTAL,
  LINES,
  MAX,
  MIN,
  NUMBERS,
  ORIENTATION,
  PROGRESS_BAR,
  RANGE,
  SCALE,
  STEP,
  TO,
  TOOLTIPS,
  VERTICAL,
} from '../../../app/Model/constants';
import ConfigurationPanel from '../configuration-panel/ConfigurationPanel';
import { SliderDemoOptions } from './types';
import { ScaleOptions } from '../../../app/View/Scale/types';

class SliderDemo {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private options: SliderDemoOptions;

  private configurationPanel?: ConfigurationPanel;
  private $slider?: JQuery<HTMLElement>;
  private slider?: JustSlider;

  static isScaleProperty(
    property: keyof JustSliderOptions | keyof ScaleOptions
  ): property is keyof ScaleOptions {
    return (property === DENSITY || property === NUMBERS || property === LINES);
  }

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
        handleInputChange: this.handleInputChange.bind(this, FROM),
      },
      inputTo: {
        ...options.configurationPanel.inputFrom,
        handleInputChange: this.handleInputChange.bind(this, TO),
      },
      inputMin: {
        ...options.configurationPanel.inputMin,
        handleInputChange: this.handleInputChange.bind(this, MIN),
      },
      inputMax: {
        ...options.configurationPanel.inputMax,
        handleInputChange: this.handleInputChange.bind(this, MAX),
      },
      inputStep: {
        ...options.configurationPanel.inputStep,
        handleInputChange: this.handleInputChange.bind(this, STEP),
      },
      toggleVertical: {
        ...options.configurationPanel.toggleVertical,
        handleToggleChange: this.handleInputChange.bind(this, ORIENTATION),
      },
      toggleRange: {
        ...options.configurationPanel.toggleRange,
        handleToggleChange: this.handleInputChange.bind(this, RANGE),
      },
      toggleBar: {
        ...options.configurationPanel.toggleBar,
        handleToggleChange: this.handleInputChange.bind(this, PROGRESS_BAR),
      },
      toggleTooltip: {
        ...options.configurationPanel.toggleTooltip,
        handleToggleChange: this.handleInputChange.bind(this, TOOLTIPS),
      },
      toggleForward: {
        ...options.configurationPanel.toggleForward,
        handleToggleChange: this.handleInputChange.bind(this, DIRECTION),
      },
      toggleScale: {
        ...options.configurationPanel.toggleScale,
        handleToggleChange: this.handleInputChange.bind(this, SCALE),
      },
      scale: {
        inputDensity: {
          ...options.configurationPanel.scale?.inputDensity,
          handleInputChange: this.handleInputChange.bind(this, DENSITY),
        },
        toggleNumbers: {
          ...options.configurationPanel.scale?.toggleNumbers,
          handleToggleChange: this.handleInputChange.bind(this, NUMBERS),
        },
        toggleLines: {
          ...options.configurationPanel.scale?.toggleLines,
          handleToggleChange: this.handleInputChange.bind(this, LINES),
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

  private handleInputChange(
    property: keyof JustSliderOptions | keyof ScaleOptions,
    value: number | boolean
  ): void {
    if ((typeof value === 'number') && (property === FROM || property === TO)) {
      this.slider?.update(property, value);
      return;
    }

    const converted = this.getConvertedValue(property, value);
    const options = { [property]: converted };

    if (SliderDemo.isScaleProperty(property)) {
      this.slider?.updateOptions({ scale: options });
    }

    this.slider?.updateOptions(options);
  }

  private getConvertedValue(
    property: keyof JustSliderOptions | keyof ScaleOptions,
    value: number | boolean
  ): JustSliderOptions[keyof JustSliderOptions] {
    if (typeof value === 'number') {
      return value;
    }

    if (property === ORIENTATION) {
      return value ? VERTICAL : HORIZONTAL;
    }

    if (property === DIRECTION) {
      return value ? FORWARD : BACKWARD;
    }

    if (property === SCALE) {
      return (value ? this.options.slider.scale : null) ?? null;
    }

    return value;
  }
}

export default SliderDemo;
