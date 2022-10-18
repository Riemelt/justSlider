type Orientation = "vertical" | "horizontal";
type Direction   = "forward" | "backward";

interface Options {
  from?:        number;
  to?:          number;
  step?:        number;
  min?:         number;
  max?:         number;
  orientation?: Orientation;
  direction?:   Direction;
  range?:       boolean;
  tooltips?:    boolean;
  progressBar?: boolean;
}