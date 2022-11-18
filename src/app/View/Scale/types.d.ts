type SegmentType = "line" | "number";
type ScaleType = "steps" | "set";

interface Segment {
  type: SegmentType;
  value: number;
}

interface ScaleOptions {
  type?:    ScaleType;
  set?:     Array<number>;
  density?: number;
  lines?:   boolean;
  numbers?: boolean;
}

interface ScaleState extends ScaleOptions {
  segments: Array<Segment>;
}

export {
  Segment,
  ScaleType,
  ScaleOptions,
  ScaleState,
}