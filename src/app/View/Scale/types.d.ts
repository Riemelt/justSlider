import {
  BIG,
  LARGE,
  LINE,
  NORMAL,
  NUMBER,
} from './constants';

type SegmentType = typeof LINE | typeof NUMBER;

type LineSize = typeof NORMAL | typeof BIG | typeof LARGE;

interface Segment {
  type: SegmentType;
  value: number;
}

interface ScaleOptions {
  density?: number;
  lines?: boolean;
  numbers?: boolean;
}

type ScaleState = Required<ScaleOptions> & {
  segments: Array<Segment>;
}

export {
  LineSize,
  Segment,
  ScaleOptions,
  ScaleState,
};
