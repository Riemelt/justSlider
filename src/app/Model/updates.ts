import {
  DIRECTION_UPDATE,
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  MIN_MAX_UPDATE,
  ORIENTATION_UPDATE,
  PRECISION_UPDATE,
  PROGRESS_BAR_UPDATE,
  RANGE_UPDATE,
  SCALE_UPDATE,
  SLIDER_UPDATE,
  STEP_UPDATE,
  TOOLTIPS_UPDATE,
} from '../EventManager/constants';
import {
  SliderEvent,
} from '../EventManager/types';
import {
  Options,
} from '../types';
import {
  Update,
  Updates,
} from './types';

const UPDATES: Updates = {
  [HANDLE_FROM_MOVE]: {
    events: [HANDLE_FROM_MOVE, PROGRESS_BAR_UPDATE, SLIDER_UPDATE],
    stateUpdates: [HANDLE_FROM_MOVE],
  },
  [HANDLE_TO_MOVE]: {
    events: [HANDLE_TO_MOVE, PROGRESS_BAR_UPDATE, SLIDER_UPDATE],
    stateUpdates: [HANDLE_TO_MOVE],
  },
  [ORIENTATION_UPDATE]: {
    events: [
      ORIENTATION_UPDATE,
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      SCALE_UPDATE,
      SLIDER_UPDATE,
    ],
    stateUpdates: [ORIENTATION_UPDATE],
  },
  [PROGRESS_BAR_UPDATE]: {
    events: [PROGRESS_BAR_UPDATE, SLIDER_UPDATE],
    stateUpdates: [PROGRESS_BAR_UPDATE],
  },
  [TOOLTIPS_UPDATE]: {
    events: [TOOLTIPS_UPDATE, SLIDER_UPDATE],
    stateUpdates: [TOOLTIPS_UPDATE],
  },
  [SCALE_UPDATE]: {
    events: [SCALE_UPDATE, SLIDER_UPDATE],
    stateUpdates: [SCALE_UPDATE],
  },
  [DIRECTION_UPDATE]: {
    events: [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      SCALE_UPDATE,
      SLIDER_UPDATE,
    ],
    stateUpdates: [DIRECTION_UPDATE],
  },
  [STEP_UPDATE]: {
    events: [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      SCALE_UPDATE,
      SLIDER_UPDATE,
    ],
    stateUpdates: [
      STEP_UPDATE,
      PRECISION_UPDATE,
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      SCALE_UPDATE,
    ],
  },
  [MIN_MAX_UPDATE]: {
    events: [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      SCALE_UPDATE,
      SLIDER_UPDATE,
    ],
    stateUpdates: [
      MIN_MAX_UPDATE,
      STEP_UPDATE,
      PRECISION_UPDATE,
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      SCALE_UPDATE,
    ],
  },
  [PRECISION_UPDATE]: {
    events: [TOOLTIPS_UPDATE, SCALE_UPDATE, SLIDER_UPDATE],
    stateUpdates: [PRECISION_UPDATE, SCALE_UPDATE],
  },
  [RANGE_UPDATE]: {
    events: [HANDLE_TO_MOVE, PROGRESS_BAR_UPDATE, SLIDER_UPDATE],
    stateUpdates: [RANGE_UPDATE, HANDLE_TO_MOVE],
  },
};

const getUpdates = function getUpdates({
  from,
  to,
  min,
  max,
  step,
  orientation,
  direction,
  range,
  tooltips,
  progressBar,
  scale,
  precision,
}: Options): Update {
  const propertiesToUpdate: Set<SliderEvent> = new Set();
  const eventsToDispatch: Set<SliderEvent> = new Set();

  if (min !== undefined || max !== undefined) {
    addUpdates(MIN_MAX_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (step !== undefined) {
    addUpdates(STEP_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (range !== undefined) {
    addUpdates(RANGE_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (direction !== undefined) {
    addUpdates(DIRECTION_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (orientation !== undefined) {
    addUpdates(ORIENTATION_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (progressBar !== undefined) {
    addUpdates(PROGRESS_BAR_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (tooltips !== undefined) {
    addUpdates(TOOLTIPS_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (to !== undefined) {
    addUpdates(HANDLE_TO_MOVE, propertiesToUpdate, eventsToDispatch);
  }

  if (from !== undefined) {
    addUpdates(HANDLE_FROM_MOVE, propertiesToUpdate, eventsToDispatch);
  }

  if (scale !== undefined) {
    addUpdates(SCALE_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  if (precision !== undefined) {
    addUpdates(PRECISION_UPDATE, propertiesToUpdate, eventsToDispatch);
  }

  return {
    events: [...eventsToDispatch],
    stateUpdates: [...propertiesToUpdate],
  };
};

const addUpdates = function addUpdates(
  event: keyof Updates,
  propertiesToUpdate: Set<SliderEvent>,
  eventsToDispatch: Set<SliderEvent>
) {
  const { events, stateUpdates } = UPDATES[event];
  events.forEach((event) => eventsToDispatch.add(event));
  stateUpdates.forEach((update) => propertiesToUpdate.add(update));
};

export {
  UPDATES,
  getUpdates,
};
