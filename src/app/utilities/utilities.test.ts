import {
  BACKWARD,
  FORWARD,
  HORIZONTAL,
  VERTICAL,
} from '../Model/constants';
import {
  Orientation,
  Direction,
} from '../types';
import {
  getTransformStyles,
  getPositionStyles,
  convertViewPositionToModel,
  getValueBasedOnPrecision,
} from './utilities';

describe('View utilities', () => {
  describe('getPositionStyles', () => {
    const testCases: Array<{
      options: {
        shift: number,
        min: number,
        max: number,
        orientation: Orientation,
        direction: Direction,
      },
      expected: {
        property: string,
        style: string,
      },
      case: string,
    }> = [
      {
        options: {
          shift: 99,
          min: 0,
          max: 100,
          orientation: HORIZONTAL,
          direction: FORWARD,
        },
        expected: {
          property: 'left',
          style: '99%',
        },
        case: 'horizontal and forward, range is from 0 to 100, shift is 99',
      },
      {
        options: {
          shift: 100,
          min: -100,
          max: 300,
          orientation: HORIZONTAL,
          direction: FORWARD,
        },
        expected: {
          property: 'left',
          style: '50%',
        },
        case: 'horizontal and forward, range is from -100 to 300, shift is 100',
      },
      {
        options: {
          shift: 200,
          min: -100,
          max: 300,
          orientation: HORIZONTAL,
          direction: BACKWARD,
        },
        expected: {
          property: 'left',
          style: '25%',
        },
        case: `horizontal and backward,
          range is from -100 to 300,
          shift is 200`,
      },
      {
        options: {
          shift: 200,
          min: -100,
          max: 300,
          orientation: VERTICAL,
          direction: BACKWARD,
        },
        expected: {
          property: 'bottom',
          style: '25%',
        },
        case: 'vertical and backward, range is from -100 to 300, shift is 200',
      },
      {
        options: {
          shift: 200,
          min: -100,
          max: 300,
          orientation: VERTICAL,
          direction: FORWARD,
        },
        expected: {
          property: 'bottom',
          style: '75%',
        },
        case: 'vertical and forward, range is from -100 to 300, shift is 200',
      },
    ];

    test.each(testCases)(
      'Returns "$expected" when $case',
      ({ options, expected }) => {
        expect(getPositionStyles(options)).toEqual(expected);
      }
    );
  });

  describe('getTransformStyles', () => {
    const testCases: Array<{
      options: {
        shift: number,
        min: number,
        max: number,
        orientation: Orientation,
        direction: Direction,
        scale?: number,
      },
      expected: {
        property: string,
        style: string,
      },
      case: string,
    }> = [
      {
        options: {
          shift: 99,
          min: 0,
          max: 100,
          orientation: HORIZONTAL,
          direction: FORWARD,
        },
        expected: {
          property: 'transform',
          style: 'translateX(-1%)',
        },
        case: `horizontal and forward,
          range is from 0 to 100,
          shift is 99,
          no scale`,
      },
      {
        options: {
          shift: 100,
          min: -100,
          max: 300,
          orientation: HORIZONTAL,
          direction: FORWARD,
        },
        expected: {
          property: 'transform',
          style: 'translateX(-50%)',
        },
        case: `horizontal and forward,
          range is from -100 to 300,
          shift is 100,
          no scale`,
      },
      {
        options: {
          shift: 100,
          min: -100,
          max: 300,
          orientation: HORIZONTAL,
          direction: FORWARD,
          scale: 0.4,
        },
        expected: {
          property: 'transform',
          style: 'translateX(-50%) scaleX(0.4)',
        },
        case: `horizontal and forward,
          range is from -100 to 300,
          shift is 100,
          scale is 0.4`,
      },
      {
        options: {
          shift: 200,
          min: -100,
          max: 300,
          orientation: HORIZONTAL,
          direction: BACKWARD,
          scale: 0.4,
        },
        expected: {
          property: 'transform',
          style: 'translateX(-75%) scaleX(0.4)',
        },
        case: `horizontal and backward,
          range is from -100 to 300,
          shift is 200,
          scale is 0.4`,
      },
      {
        options: {
          shift: 200,
          min: -100,
          max: 300,
          orientation: VERTICAL,
          direction: BACKWARD,
          scale: 0.4,
        },
        expected: {
          property: 'transform',
          style: 'translateY(75%) scaleY(0.4)',
        },
        case: `vertical and backward,
          range is from -100 to 300,
          shift is 200,
          scale is 0.4`,
      },
      {
        options: {
          shift: 200,
          min: -100,
          max: 300,
          orientation: VERTICAL,
          direction: FORWARD,
          scale: 0.4,
        },
        expected: {
          property: 'transform',
          style: 'translateY(25%) scaleY(0.4)',
        },
        case: `vertical and forward,
          range is from -100 to 300,
          shift is 200,
          scale is 0.4`,
      },
    ];

    test.each(testCases)(
      'Returns "$expected" when $case',
      ({ options, expected }) => {
        expect(getTransformStyles(options)).toEqual(expected);
      }
    );
  });

  describe('convertViewPositionToModel', () => {
    const testCases: Array<{
      options: {
        position: number
        shift: number,
        length: number,
        min: number,
        max: number,
        orientation: Orientation,
        direction: Direction,
      },
      expected: number,
      case: string,
    }> = [
      {
        options: {
          min: -100,
          max: 300,
          orientation: HORIZONTAL,
          direction: FORWARD,
          length: 500,
          shift: 100,
          position: 200,
        },
        expected: -20,
        case: `horizontal and forward,
          range is from -100 to 300,
          shift is 100,
          length is 500,
          position is 200`,
      },
      {
        options: {
          min: -100,
          max: 300,
          orientation: HORIZONTAL,
          direction: BACKWARD,
          length: 500,
          shift: 100,
          position: 200,
        },
        expected: 220,
        case: `horizontal and backward,
          range is from -100 to 300,
          shift is 100,
          length is 500,
          position is 200`,
      },
      {
        options: {
          min: -100,
          max: 300,
          orientation: VERTICAL,
          direction: BACKWARD,
          length: 500,
          shift: 100,
          position: 200,
        },
        expected: -20,
        case: `vertical and backward,
          range is from -100 to 300,
          shift is 100,
          length is 500,
          position is 200`,
      },
      {
        options: {
          min: -100,
          max: 300,
          orientation: VERTICAL,
          direction: FORWARD,
          length: 500,
          shift: 100,
          position: 200,
        },
        expected: 220,
        case: `vertical and forward,
          range is from -100 to 300,
          shift is 100,
          length is 500,
          position is 200`,
      },
    ];

    test.each(testCases)(
      'Returns "$expected" when $case',
      ({ options, expected }) => {
        expect(convertViewPositionToModel(options)).toBe(expected);
      }
    );
  });

  describe('getValueBasedOnPrecision', () => {
    const testCases: Array<{
      value: number,
      precision: number,
      expected: string,
    }> = [
      {
        value: 20,
        precision: 0,
        expected: '20',
      },
      {
        value: 20.1,
        precision: 0,
        expected: '20',
      },
      {
        value: 20.123,
        precision: 1,
        expected: '20.1',
      },
      {
        value: 20.168,
        precision: 2,
        expected: '20.17',
      },
    ];

    test.each(testCases)(
      'Returns "$expected" when $value and $precision',
      ({ value, precision, expected }) => {
        expect(getValueBasedOnPrecision(value, precision)).toBe(expected);
      }
    );
  });
});
