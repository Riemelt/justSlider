import { FORWARD, VERTICAL } from '../../../app/Model/constants';
import { Options } from '../../../app/types';
import { ScaleOptions } from '../../../app/View/Scale/types';
import { camelToSnakeCase } from '../../utilities/utilities';
import InputField from '../input-field/InputField';
import Toggle from '../toggle/Toggle';
import {
  INPUT_FROM,
  INPUT_MAX,
  INPUT_MIN,
  INPUT_SCALE_DENSITY,
  INPUT_STEP,
  panelInputs,
  panelToggles,
  TOGGLE_BAR,
  TOGGLE_FORWARD,
  TOGGLE_RANGE,
  TOGGLE_SCALE,
  TOGGLE_SCALE_LINES,
  TOGGLE_SCALE_NUMBERS,
  TOGGLE_TOOLTIP,
  TOGGLE_VERTICAL,
} from './constants';
import {
  ConfigurationPanelOptions,
  Inputs,
  Toggles,
  PanelInput,
  PanelToggle,
  InputFieldUpdate,
  ToggleUpdate,
} from './types';

class ConfigurationPanel {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private options: ConfigurationPanelOptions;
  private inputs: Inputs = {};
  private toggles: Toggles = {};

  constructor(
    $parent: JQuery<HTMLElement>,
    options: ConfigurationPanelOptions
  ) {
    this.className = 'configuration-panel';
    this.options = options;
    this.$component = $parent.find(`.js-${this.className}`);
    this.init();
  }

  public update({
    orientation,
    direction,
    from = 0,
    to = 0,
    min = 0,
    max = 100,
    step = 10,
    progressBar = false,
    tooltips = false,
    range = false,
    scale = null,
  }: Options = {}): void {
    this.updateInputTo(range, step, min, to);

    const inputFieldUpdates: Array<InputFieldUpdate> = [
      {
        name: INPUT_FROM,
        value: { step, min, value: from },
      },
      {
        name: INPUT_STEP,
        value: { value: step },
      },
      {
        name: INPUT_MIN,
        value: { value: min },
      },
      {
        name: INPUT_MAX,
        value: { value: max },
      },
    ];

    this.updateInputFields(inputFieldUpdates);

    const toggleUpdates: Array<ToggleUpdate> = [
      {
        name: TOGGLE_VERTICAL,
        value: orientation === VERTICAL,
      },
      {
        name: TOGGLE_FORWARD,
        value: direction === FORWARD,
      },
      {
        name: TOGGLE_BAR,
        value: progressBar,
      },
      {
        name: TOGGLE_RANGE,
        value: range,
      },
      {
        name: TOGGLE_TOOLTIP,
        value: tooltips,
      },
      {
        name: TOGGLE_SCALE,
        value: scale !== null,
      },
    ];

    this.updateToggles(toggleUpdates);

    if (scale === null) {
      this.disableScale();
    } else {
      this.enableScale();
      this.updateScale(scale);
    }
  }

  private updateInputFields(inputs: Array<InputFieldUpdate>): void {
    inputs.forEach(({ name, value }) => {
      this.inputs[name]?.update(value);
    });
  }

  private updateToggles(toggles: Array<ToggleUpdate>): void {
    toggles.forEach(({ name, value }) => {
      this.toggles[name]?.update(value);
    });
  }

  private updateInputTo(
    range: boolean,
    step: number,
    min: number,
    to: number,
  ): void {
    if (range) {
      this.inputs.inputTo?.enable();
      this.inputs.inputTo?.update({ step, min, value: to });
      return;
    }

    this.inputs.inputTo?.disable();
  }

  private enableScale() {
    this.inputs.inputScaleDensity?.enable();
    this.toggles.toggleScaleNumbers?.enable();
    this.toggles.toggleScaleNumbers?.enable();
  }

  private disableScale() {
    this.inputs.inputScaleDensity?.disable();
    this.toggles.toggleScaleNumbers?.disable();
    this.toggles.toggleScaleNumbers?.disable();
  }

  private updateScale(scale: ScaleOptions) {
    this.updateInputFields([
      {
        name: INPUT_SCALE_DENSITY,
        value: { value: scale.density ?? 0 },
      },
    ]);

    this.updateToggles([
      {
        name: TOGGLE_SCALE_NUMBERS,
        value: scale.numbers ?? false,
      },
      {
        name: TOGGLE_SCALE_LINES,
        value: scale.lines ?? false,
      },
    ]);
  }

  private initInput(input: PanelInput): void {
    const className = camelToSnakeCase(input.name);

    this.inputs[input.name] = new InputField(
      this.$component.find(`.js-${this.className}__${className}`),
      this.options[input.name],
    );
  }

  private initToggle(toggle: PanelToggle): void {
    const className = camelToSnakeCase(toggle.name);

    this.toggles[toggle.name] = new Toggle(
      this.$component.find(`.js-${this.className}__${className}`),
      this.options[toggle.name],
    );
  }

  private init(): void {
    panelInputs.forEach(this.initInput.bind(this));
    panelToggles.forEach(this.initToggle.bind(this));

    this.inputs.inputScaleDensity?.update({ step: 0.1 });
  }
}

export default ConfigurationPanel;
