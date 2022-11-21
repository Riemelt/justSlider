import Subject from "./Subject/Subject";

type SliderEvent =
  "HandleFromMove"     |
  "HandleToMove"       |
  "SliderUpdate"       |
  "OrientationUpdate"  |
  "ProgressBarUpdate"  |
  "TooltipsUpdate"     |
  "ScaleUpdate"        |
  "SliderClickDisable" |
  "SliderClickEnable";


type EventSubjects = {
  [key in SliderEvent]?: Subject;
};