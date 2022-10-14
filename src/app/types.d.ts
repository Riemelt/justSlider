type Orientation = "vertical" | "horizontal";

interface Options {
  from?:        number;
  to?:          number;
  step?:        number;
  min?:         number;
  max?:         number;
  isRange?:     boolean;
  orientation?: Orientation;
}