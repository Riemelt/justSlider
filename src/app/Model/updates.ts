import { Options } from '../types';
import { Update, Updates, ModelEvent } from './types';
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
} from './constants';

const UPDATES: Updates = {
  [HANDLE_FROM_MOVE]: {
    events: [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      SLIDER_UPDATE,
    ],
    stateUpdates: [HANDLE_FROM_MOVE],
  },
  [HANDLE_TO_MOVE]: {
    events: [
      HANDLE_TO_MOVE,
      HANDLE_FROM_MOVE,
      PROGRESS_BAR_UPDATE,
      SLIDER_UPDATE,
    ],
    stateUpdates: [HANDLE_TO_MOVE],
  },
  [ORIENTATION_UPDATE]: {
    events: [
      ORIENTATION_UPDATE,
      SCALE_UPDATE,
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
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
    events: [SCALE_UPDATE, TOOLTIPS_UPDATE, SLIDER_UPDATE],
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
      SCALE_UPDATE,
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
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
      SCALE_UPDATE,
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
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
  [RANGE_UPDATE]: {
    events: [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      SLIDER_UPDATE,
    ],
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
}: Options): Update {
  const propertiesToUpdate: Set<ModelEvent> = new Set();
  const eventsToDispatch: Set<ModelEvent> = new Set();

  const options = {
    min,
    max,
    step,
    range,
    direction,
    orientation,
    progressBar,
    tooltips,
    to,
    from,
    scale,
  };

  const events: Array<keyof Updates> = [
    MIN_MAX_UPDATE,
    MIN_MAX_UPDATE,
    STEP_UPDATE,
    RANGE_UPDATE,
    DIRECTION_UPDATE,
    ORIENTATION_UPDATE,
    PROGRESS_BAR_UPDATE,
    TOOLTIPS_UPDATE,
    HANDLE_TO_MOVE,
    HANDLE_FROM_MOVE,
    SCALE_UPDATE,
  ];

  const optionsAndEvents: Array<{
    value: Options[keyof Options],
    event: keyof Updates,
  }> = Object.values(options).map((value, index) => (
    {
      value,
      event: events[index],
    }
  ));

  optionsAndEvents.forEach(({ value, event }) => {
    if (value !== undefined) {
      addUpdates(event, propertiesToUpdate, eventsToDispatch);
    }
  });

  return {
    events: [...eventsToDispatch],
    stateUpdates: [...propertiesToUpdate],
  };
};

const addUpdates = function addUpdates(
  event: keyof Updates,
  propertiesToUpdate: Set<ModelEvent>,
  eventsToDispatch: Set<ModelEvent>
) {
  const { events, stateUpdates } = UPDATES[event];
  events.forEach((event) => eventsToDispatch.add(event));
  stateUpdates.forEach((update) => propertiesToUpdate.add(update));
};

export {
  UPDATES,
  getUpdates,
};
