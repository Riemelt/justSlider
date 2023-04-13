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
  NUMBERS,
  ORIENTATION,
  SCALE,
  TO,
  VERTICAL,
} from '../../../app/Model/constants';
import { ScaleOptions } from '../../../app/View/Scale/types';
import { ConfigurationPanelOptions } from '../configuration-panel/types';
import ConfigurationPanel from '../configuration-panel/ConfigurationPanel';
import { panelInputs, panelToggles } from '../configuration-panel/constants';
import { SliderDemoOptions } from './types';

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
      ...this.getPanelOptions(),
    });

    this.$slider = this.$component.find(`.js-${this.className}__slider`);
    this.$slider.justSlider({
      ...this.options.slider,
      onUpdate: this.handleSliderUpdate.bind(this),
    });

    this.slider = this.$slider.data('just-slider');
  }

  private getPanelOptions(): ConfigurationPanelOptions {
    const options: ConfigurationPanelOptions = {};
    const inputsCollection = [panelInputs, panelToggles];

    inputsCollection.forEach((inputs) => {
      inputs.forEach(({ name, option }) => {
        options[name] = {
          ...this.options.configurationPanel[name],
          handleChange: this.handleInputChange.bind(this, option),
        };
      });
    });

    return options;
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
      return;
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
