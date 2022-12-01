import Subject from "./Subject/Subject";
import {
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  SLIDER_UPDATE,
  ORIENTATION_UPDATE,
  PROGRESS_BAR_UPDATE,
  TOOLTIPS_UPDATE,
  SCALE_UPDATE,
  SLIDER_CLICK_DISABLE,
  SLIDER_CLICK_ENABLE,
} from "./constants";

type SliderEvent =
  typeof HANDLE_FROM_MOVE     |
  typeof HANDLE_TO_MOVE       |
  typeof SLIDER_UPDATE        |
  typeof ORIENTATION_UPDATE   |
  typeof PROGRESS_BAR_UPDATE  |
  typeof TOOLTIPS_UPDATE      |
  typeof SCALE_UPDATE         |
  typeof SLIDER_CLICK_DISABLE |
  typeof SLIDER_CLICK_ENABLE;


type EventSubjects = {
  [key in SliderEvent]?: Subject;
};