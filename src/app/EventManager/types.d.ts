import Subject from "./Subject/Subject";

type SliderEvent =
  "HandleFromMove"     |
  "HandleToMove"       |
  "SliderUpdate"       |
  "OrientationUpdate"  |
  "ProgressBarUpdate"  |
  "TooltipsUpdate"     |
  "SliderClickDisable" |
  "SliderClickEnable";


type EventSubjects = {
  [key in SliderEvent]?: Subject;
};