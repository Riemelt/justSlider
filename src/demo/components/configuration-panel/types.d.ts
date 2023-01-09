interface ConfigurationPanelOptions {
  inputMin?: InputFieldOptions;
  inputMax?: InputFieldOptions;
  inputStep?: InputFieldOptions;
  inputFrom?: InputFieldOptions;
  inputTo?: InputFieldOptions;
  inputPrecision?: InputFieldOptions;
  toggleVertical?: ToggleOptions;
  toggleRange?: ToggleOptions;
  toggleBar?: ToggleOptions;
  toggleTooltip?: ToggleOptions;
  toggleForward?: ToggleOptions;
  toggleScale?: ToggleOptions;
  scale?: {
    inputDensity?: InputFieldOptions;
    toggleNumbers?: ToggleOptions;
    toggleLines?: ToggleOptions;
  }
}
