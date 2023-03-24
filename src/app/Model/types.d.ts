import {
  DIRECTION_UPDATE,
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  MIN_MAX_UPDATE,
  ORIENTATION_UPDATE,
  PROGRESS_BAR_UPDATE,
  RANGE_UPDATE,
  SCALE_UPDATE,
  STEP_UPDATE,
  TOOLTIPS_UPDATE,
} from '../EventManager/constants';
import {
  SliderEvent,
} from '../EventManager/types';
import {
  FROM,
  RANGE,
  TO,
} from './constants';

type HandleType = typeof FROM | typeof TO;
type TooltipType = typeof FROM | typeof TO | typeof RANGE;

interface Update {
  events: Array<SliderEvent>;
  stateUpdates: Array<SliderEvent>;
}

type Updates = {
  [DIRECTION_UPDATE]: Update,
  [HANDLE_FROM_MOVE]: Update,
  [HANDLE_TO_MOVE]: Update,
  [MIN_MAX_UPDATE]: Update,
  [ORIENTATION_UPDATE]: Update,
  [PROGRESS_BAR_UPDATE]: Update,
  [RANGE_UPDATE]: Update,
  [SCALE_UPDATE]: Update,
  [STEP_UPDATE]: Update,
  [TOOLTIPS_UPDATE]: Update,
}

export {
  HandleType,
  Update,
  Updates,
  TooltipType,
};
