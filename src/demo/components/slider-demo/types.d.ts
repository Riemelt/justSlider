import { Direction, Orientation } from "../../../app/types";

interface SliderOptions {
  from?:        number;
  to?:          number;
  step?:        number;
  min?:         number;
  max?:         number;
  orientation?: Orientation;
  direction?:   Direction;
  range?:       boolean;
  tooltips?:    boolean;
  progressBar?: boolean;
}

interface SliderDemoOptions {
  slider:             SliderOptions;
  configurationPanel: ConfigurationPanelOptions;
}

export {
  SliderOptions,
  SliderDemoOptions,
}