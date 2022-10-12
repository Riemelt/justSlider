import Subject from "./Subject/Subject";

type EventSubjects = {
  [key in SliderEvent]?: Subject;
};