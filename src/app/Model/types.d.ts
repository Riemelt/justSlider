import {
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  SLIDER_UPDATE,
  ORIENTATION_UPDATE,
  PROGRESS_BAR_UPDATE,
  TOOLTIPS_UPDATE,
  SCALE_UPDATE,
  DIRECTION_UPDATE,
  STEP_UPDATE,
  MIN_MAX_UPDATE,
  PRECISION_UPDATE,
  RANGE_UPDATE,
  HANDLES_SWAP,
  FROM,
  RANGE,
  TO,
} from './constants';

type HandleType = typeof FROM | typeof TO;
type TooltipType = typeof FROM | typeof TO | typeof RANGE;

type ModelEvent =
  typeof HANDLE_FROM_MOVE |
  typeof HANDLE_TO_MOVE |
  typeof SLIDER_UPDATE |
  typeof ORIENTATION_UPDATE |
  typeof PROGRESS_BAR_UPDATE |
  typeof TOOLTIPS_UPDATE |
  typeof SCALE_UPDATE |
  typeof DIRECTION_UPDATE |
  typeof STEP_UPDATE |
  typeof MIN_MAX_UPDATE |
  typeof PRECISION_UPDATE |
  typeof RANGE_UPDATE |
  typeof HANDLES_SWAP;

interface Update {
  events: Array<ModelEvent>;
  stateUpdates: Array<ModelEvent>;
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
  ModelEvent,
  HandleType,
  Update,
  Updates,
  TooltipType,
};
