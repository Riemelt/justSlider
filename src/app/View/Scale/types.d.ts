import {
  BIG,
  LARGE,
  LINE,
  NORMAL,
  NUMBER,
  SET,
  STEPS,
} from "./constants";

type SegmentType = typeof LINE  | typeof NUMBER;
type ScaleType   = typeof STEPS | typeof SET;

type LineSegmentSize = typeof NORMAL | typeof BIG | typeof LARGE;

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

type ScaleState = Required<ScaleOptions> & {
  segments: Array<Segment>;
}


export {
  LineSegmentSize,
  Segment,
  ScaleType,
  ScaleOptions,
  ScaleState,
}