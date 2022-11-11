import { Orientation, Direction } from "../types";

import {
  transform,
  convertViewPositionToModel,
} from "./utilities";

describe("View utilities", () => {
  describe("transform", () => {
    const testCases: Array<{
      options: {
        shift:       number,
        min:         number,
        max:         number,
        orientation: Orientation,
        direction:   Direction,
        scale?:      number,
      },
      expected: string,
      case: string,
    }> = [
      {
        options: { shift: 99, min: 0, max: 100, orientation: "horizontal", direction: "forward" },
        expected: "translateX(-1%)",
        case: "horizontal and forward, range is from 0 to 100, shift is 99, no scale",
      },
      {
        options: { shift: 100, min: -100, max: 300, orientation: "horizontal", direction: "forward" },
        expected: "translateX(-50%)",
        case: "horizontal and forward, range is from -100 to 300, shift is 100, no scale",
      },
      {
        options: { shift: 100, min: -100, max: 300, orientation: "horizontal", direction: "forward", scale: 0.4 },
        expected: "translateX(-50%) scaleX(0.4)",
        case: "horizontal and forward, range is from -100 to 300, shift is 100, scale is 0.4",
      },
      {
        options: { shift: 200, min: -100, max: 300, orientation: "horizontal", direction: "backward", scale: 0.4 },
        expected: "translateX(-75%) scaleX(0.4)",
        case: "horizontal and backward, range is from -100 to 300, shift is 200, scale is 0.4",
      },
      {
        options: { shift: 200, min: -100, max: 300, orientation: "vertical", direction: "backward", scale: 0.4 },
        expected: "translateY(75%) scaleY(0.4)",
        case: "vertical and backward, range is from -100 to 300, shift is 200, scale is 0.4",
      },
      {
        options: { shift: 200, min: -100, max: 300, orientation: "vertical", direction: "forward", scale: 0.4 },
        expected: "translateY(25%) scaleY(0.4)",
        case: "vertical and forward, range is from -100 to 300, shift is 200, scale is 0.4",
      },
    ];

    test.each(testCases)(`Returns "$expected" when $case`, ({ options, expected }) => {
      expect(transform(options)).toBe(expected);
    });
  });

  describe("convertViewPositionToModel", () => {
    const testCases: Array<{
      options: {
        position:    number
        shift:       number,
        length:      number,
        min:         number,
        max:         number,
        orientation: Orientation,
        direction:   Direction,
      },
      expected: number,
      case: string,
    }> = [
      {
        options: { min: -100, max: 300, orientation: "horizontal", direction: "forward", length: 500, shift: 100, position: 200 },
        expected: -20,
        case: "horizontal and forward, range is from -100 to 300, shift is 100, length is 500, position is 200",
      },
      {
        options: { min: -100, max: 300, orientation: "horizontal", direction: "backward", length: 500, shift: 100, position: 200 },
        expected: 220,
        case: "horizontal and backward, range is from -100 to 300, shift is 100, length is 500, position is 200",
      },
      {
        options: { min: -100, max: 300, orientation: "vertical", direction: "backward", length: 500, shift: 100, position: 200 },
        expected: -20,
        case: "vertical and backward, range is from -100 to 300, shift is 100, length is 500, position is 200",
      },
      {
        options: { min: -100, max: 300, orientation: "vertical", direction: "forward", length: 500, shift: 100, position: 200 },
        expected: 220,
        case: "vertical and forward, range is from -100 to 300, shift is 100, length is 500, position is 200",
      },
    ];

    test.each(testCases)(`Returns "$expected" when $case`, ({ options, expected }) => {
      expect(convertViewPositionToModel(options)).toBe(expected);
    });
  });
});