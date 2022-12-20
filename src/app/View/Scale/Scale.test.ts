import {
  FORWARD,
  HORIZONTAL,
} from '../../Model/constants';
import {
  State,
} from '../../types';
import * as Utilities from '../utilities/utilities';
import {
  LINE,
  NUMBER,
  STEPS,
} from './constants';
import Scale from './Scale';
import {
  Segment,
  ScaleState,
} from './types';


describe('Scale', () => {
  let $parent: JQuery<HTMLElement>;
  let scale: Scale;

  const scaleClass = '.just-slider__scale';
  const numberClass = '.just-slider__scale-number';
  const lineClass = '.just-slider__scale-line';
  const bigNumberClass = 'just-slider__scale-number_big';
  const largeLineClass = 'just-slider__scale-line_large';
  const bigLineClass = 'just-slider__scale-line_big';

  const segments: Array<Segment> = [
    { value: 0, type: NUMBER },
    { value: 25, type: LINE },
    { value: 50, type: NUMBER },
    { value: 75, type: LINE },
    { value: 100, type: NUMBER },
  ];

  const state: ScaleState = {
    segments,
    lines: true,
    numbers: true,
    density: 3,
    set: [],
    type: STEPS,
  };

  const modelState: State = {
    min: -100,
    max: 300,
    from: 200,
    to: 250,
    range: false,
    orientation: HORIZONTAL,
    direction: FORWARD,
    scale: state,
    step: 10,
    progressBar: false,
    tooltips: false,
    precision: 1,
  };

  beforeEach(() => {
    $parent = $('<div class="just-slider"></div>');
    scale = new Scale($parent);
  });

  test('Creates html node and appends to the parent', () => {
    const $scale = $parent.find(scaleClass);

    expect($scale.length).toBe(1);
  });

  test('Deletes html node from parent', () => {
    scale.delete();
    const $scale = $parent.find(scaleClass);

    expect($scale.length).toBe(0);
  });

  test('Handles mouse clicks on number segments', () => {
    const handler = jest.fn(() => undefined);

    scale.setNumberClickHandler(handler);
    scale.update(modelState);

    const $scale = $parent.find(scaleClass);
    const $numbers = $scale.find(numberClass);

    $numbers.last().trigger('click');

    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(100);
  });

  describe('On update', () => {
    describe('Generates html nodes', () => {
      test('Numbers', () => {
        const mocked = jest.spyOn(Utilities, 'getValueBasedOnPrecision');
        scale.update(modelState);

        const $scale = $parent.find(scaleClass);
        const $numbers = $scale.find(numberClass);

        expect($numbers.length).toBe(3);

        const { results } = mocked.mock;

        $numbers.each((index, number) => {
          const $number = $(number);
          expect($number.html()).toBe(results[index].value);
        });

        mocked.mockRestore();
      });

      test('Lines', () => {
        scale.update(modelState);

        const $scale = $parent.find(scaleClass);
        const $lines = $scale.find(lineClass);

        expect($lines.length).toBe(5);
      });

      test('Only lines', () => {
        const newState: State = {
          ...modelState,
          scale: {
            ...state,
            numbers: false,
          },
        };

        scale.update(newState);

        const $scale = $parent.find(scaleClass);
        const $lines = $scale.find(lineClass);

        expect($lines.length).toBe(5);

        const $numbers = $scale.find(numberClass);
        expect($numbers.length).toBe(0);
      });

      test('Only numbers', () => {
        scale.update({
          ...modelState,
          scale: {
            ...state,
            lines: false,
          },
        });

        const $scale = $parent.find(scaleClass);
        const $lines = $scale.find(lineClass);

        expect($lines.length).toBe(0);

        const $numbers = $scale.find(numberClass);
        expect($numbers.length).toBe(3);
      });
    });

    test('Sets style modifier if lines are disabled', () => {
      scale.update({
        ...modelState,
        scale: {
          ...state,
          lines: false,
        },
      });

      const $scale = $parent.find(scaleClass);
      expect($scale.hasClass('just-slider__scale_without-lines')).toBe(true);
    });

    test('Sets style modifier for first and last number values', () => {
      scale.update(modelState);

      const $scale = $parent.find(scaleClass);
      const $numbers = $scale.find(numberClass);

      expect($numbers.first().hasClass(bigNumberClass)).toBe(true);
      expect($numbers.last().hasClass(bigNumberClass)).toBe(true);
    });

    test('Sets style modifier for line segments', () => {
      scale.update(modelState);

      const $scale = $parent.find(scaleClass);
      const $lines = $scale.find(lineClass);


      expect($lines.first().hasClass(largeLineClass)).toBe(true);
      expect($lines.last().hasClass(largeLineClass)).toBe(true);
      expect($lines.eq(2).hasClass(bigLineClass)).toBe(true);
    });

    test('Sets position styles for segments', () => {
      const mockedPosition = jest.spyOn(Utilities, 'getPositionStyles');

      scale.update(modelState);

      const segmentPoints: Array<Segment> = segments.reduce((
        acc: Array<Segment>,
        value: Segment
      ) => {
        acc.push(value);
        if (value.type === NUMBER) {
          acc.push({
            value: value.value,
            type: LINE,
          });
        }

        return acc;
      }, []);

      segmentPoints.forEach((segment, index) => {
        expect(mockedPosition).toHaveBeenNthCalledWith(index + 1, {
          min: modelState.min,
          max: modelState.max,
          orientation: modelState.orientation,
          direction: modelState.direction,
          shift: segment.value,
        });
      });

      mockedPosition.mockRestore();
    });
  });
});

