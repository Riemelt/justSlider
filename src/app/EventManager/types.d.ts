import Subject from './Subject/Subject';
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
} from './constants';

type SliderEvent =
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

type EventSubjects = {
  [key in SliderEvent]?: Subject;
};
