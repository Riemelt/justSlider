import { JustSliderOptions } from '../../../app/types';
import { ScaleOptions } from '../../../app/View/Scale/types';
import InputField from '../input-field/InputField';
import { InputFieldOptions, InputUpdate } from '../input-field/types';
import Toggle from '../toggle/Toggle';
import { ToggleOptions } from '../toggle/types';
import {
  INPUT_FROM,
  INPUT_MAX,
  INPUT_MIN,
  INPUT_SCALE_DENSITY,
  INPUT_STEP,
  INPUT_TO,
  TOGGLE_BAR,
  TOGGLE_FORWARD,
  TOGGLE_RANGE,
  TOGGLE_SCALE,
  TOGGLE_SCALE_LINES,
  TOGGLE_SCALE_NUMBERS,
  TOGGLE_TOOLTIP,
  TOGGLE_VERTICAL,
} from './constants';

type InputFieldType =
  typeof INPUT_FROM |
  typeof INPUT_TO |
  typeof INPUT_MIN |
  typeof INPUT_MAX |
  typeof INPUT_STEP |
  typeof INPUT_SCALE_DENSITY;

type ToggleType =
  typeof TOGGLE_VERTICAL |
  typeof TOGGLE_RANGE |
  typeof TOGGLE_BAR |
  typeof TOGGLE_TOOLTIP |
  typeof TOGGLE_FORWARD |
  typeof TOGGLE_SCALE |
  typeof TOGGLE_SCALE_NUMBERS |
  typeof TOGGLE_SCALE_LINES;

interface ScalePanelOptions {
  inputDensity?: InputFieldOptions;
  toggleNumbers?: ToggleOptions;
  toggleLines?: ToggleOptions;
}

type InputsOptions = {
  [key in InputFieldType]?: InputFieldOptions;
}

type TogglesOptions = {
  [key in ToggleType]?: ToggleOptions;
}

type ConfigurationPanelOptions = InputsOptions & TogglesOptions;

type OptionsToTypes<T> = {
  [K in keyof T]: InputFieldOptions extends T[K]
    ? InputField
    : Toggle;
}

type Inputs = Partial<OptionsToTypes<InputsOptions>>;
type Toggles = Partial<OptionsToTypes<TogglesOptions>>;

interface PanelInput {
  name: keyof Inputs;
  option: keyof JustSliderOptions | keyof ScaleOptions;
}

interface PanelToggle {
  name: keyof Toggles;
  option: keyof JustSliderOptions | keyof ScaleOptions;
}

interface InputFieldUpdate {
  value: InputUpdate;
  name: keyof Inputs;
}

interface ToggleUpdate {
  value: boolean;
  name: keyof Toggles;
}

export {
  PanelInput,
  PanelToggle,
  Inputs,
  Toggles,
  ConfigurationPanelOptions,
  ScalePanelOptions,
  InputFieldType,
  ToggleType,
  InputFieldUpdate,
  ToggleUpdate,
};
