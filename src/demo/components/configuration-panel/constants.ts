import {
  DENSITY,
  DIRECTION,
  FROM,
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
} from '../../../app/Model/constants';
import { PanelInput, PanelToggle } from './types';

const INPUT_FROM = 'inputFrom';
const INPUT_TO = 'inputTo';
const INPUT_MIN = 'inputMin';
const INPUT_MAX = 'inputMax';
const INPUT_STEP = 'inputStep';
const INPUT_SCALE_DENSITY = 'inputScaleDensity';

const TOGGLE_VERTICAL = 'toggleVertical';
const TOGGLE_RANGE = 'toggleRange';
const TOGGLE_BAR = 'toggleBar';
const TOGGLE_TOOLTIP = 'toggleTooltip';
const TOGGLE_FORWARD = 'toggleForward';
const TOGGLE_SCALE = 'toggleScale';
const TOGGLE_SCALE_NUMBERS = 'toggleScaleNumbers';
const TOGGLE_SCALE_LINES = 'toggleScaleLines';

const panelInputs: Array<PanelInput> = [
  {
    name: 'inputFrom',
    option: FROM,
  },
  {
    name: 'inputTo',
    option: TO,
  },
  {
    name: 'inputMin',
    option: MIN,
  },
  {
    name: 'inputMax',
    option: MAX,
  },
  {
    name: 'inputStep',
    option: STEP,
  },
  {
    name: 'inputScaleDensity',
    option: DENSITY,
  },
];

const panelToggles: Array<PanelToggle> = [
  {
    name: 'toggleVertical',
    option: ORIENTATION,
  },
  {
    name: 'toggleRange',
    option: RANGE,
  },
  {
    name: 'toggleBar',
    option: PROGRESS_BAR,
  },
  {
    name: 'toggleTooltip',
    option: TOOLTIPS,
  },
  {
    name: 'toggleForward',
    option: DIRECTION,
  },
  {
    name: 'toggleScale',
    option: SCALE,
  },
  {
    name: 'toggleScaleNumbers',
    option: NUMBERS,
  },
  {
    name: 'toggleScaleLines',
    option: LINES,
  },
];

export {
  INPUT_FROM,
  INPUT_TO,
  INPUT_MIN,
  INPUT_MAX,
  INPUT_STEP,
  INPUT_SCALE_DENSITY,
  TOGGLE_VERTICAL,
  TOGGLE_RANGE,
  TOGGLE_BAR,
  TOGGLE_TOOLTIP,
  TOGGLE_FORWARD,
  TOGGLE_SCALE,
  TOGGLE_SCALE_NUMBERS,
  TOGGLE_SCALE_LINES,
  panelInputs,
  panelToggles,
};
