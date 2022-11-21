import Scale from "./Scale";
import * as Utilities from "../utilities/utilities";

import {
  Segment,
  ScaleState,
} from "./types";
import { State } from "../../types";

describe("Scale", () => {
  let $parent: JQuery<HTMLElement>;
  let scale:   Scale;

  const scaleClass  = ".just-slider__scale";
  const numberClass = ".just-slider__scale-number";
  const lineClass   = ".just-slider__scale-line";

  const segments: Array<Segment> = [
    { value: 0, type: "number" },
    { value: 25, type: "line" },
    { value: 50, type: "number" },
    { value: 75, type: "line" },
    { value: 100, type: "number" },
  ];

  const numbers: Array<Segment> = segments.filter(segment => segment.type === "number");

  const state: ScaleState = {
    segments,
    lines: true,
    numbers: true,
  };

  const modelState: State = {
    min:         -100,
    max:         300,
    from:        200,
    to:          250,
    range:       false,
    orientation: "horizontal",
    direction:   "forward",
    scale:       state,
  };

  beforeEach(() => {
    $parent = $(`<div class="just-slider"></div>`);
    scale = new Scale($parent);
  });

  test("Creates html node and appends to the parent", () => {
    const $scale = $parent.find(scaleClass);
  
    expect($scale.length).toBe(1);
  });
  
  test("Deletes html node from parent", () => {
    scale.delete();
    const $scale = $parent.find(scaleClass);
  
    expect($scale.length).toBe(0);
  });

  test("Handles mouse clicks on number segments", () => {
    const handler = jest.fn(() => undefined);

    scale.setNumberClickHandler(handler);
    scale.update(modelState);

    const $scale = $parent.find(scaleClass);
    const $numbers = $scale.find(numberClass);

    $numbers.last().trigger("click");

    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(100);
  });

  describe("On update", () => {
    describe("Generates html nodes", () => {
      test("Numbers", () => {
        const mocked = jest.spyOn(Utilities, "getValueBasedOnPrecision");
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
      })
  
      test("Lines", () => {
        scale.update(modelState);
  
        const $scale = $parent.find(scaleClass);
        const $lines = $scale.find(lineClass);
  
        expect($lines.length).toBe(5);
      })

      test("Only lines", () => {
        scale.update({
          ...modelState,
          scale: { 
            ...modelState.scale,
            numbers: false,
          }
        });
  
        const $scale = $parent.find(scaleClass);
        const $lines = $scale.find(lineClass);

        expect($lines.length).toBe(5);

        const $numbers = $scale.find(numberClass);
        expect($numbers.length).toBe(0);
      })

      test("Only numbers", () => {
        scale.update({
          ...modelState,
          scale: { 
            ...modelState.scale,
            lines: false,
          }
        });
  
        const $scale = $parent.find(scaleClass);
        const $lines = $scale.find(lineClass);

        expect($lines.length).toBe(0);

        const $numbers = $scale.find(numberClass);
        expect($numbers.length).toBe(3);
      })
    });

    test("Sets style modificator if lines are disabled", () => {
      scale.update({
        ...modelState,
        scale: { 
          ...modelState.scale,
          lines: false,
        }
      });

      const $scale = $parent.find(scaleClass);
      expect($scale.hasClass("just-slider__scale_without-lines")).toBe(true);
    });

    test("Sets style modificators for first and last number values", () => {
      scale.update(modelState);

      const $scale = $parent.find(scaleClass);
      const $numbers = $scale.find(numberClass);

      expect($numbers.first().hasClass("just-slider__scale-number_big")).toBe(true);
      expect($numbers.last().hasClass("just-slider__scale-number_big")).toBe(true);
    });

    test("Sets style modificators for line segments", () => {
      scale.update(modelState);

      const $scale = $parent.find(scaleClass);
      const $lines = $scale.find(lineClass);

      expect($lines.first().hasClass("just-slider__scale-line_large")).toBe(true);
      expect($lines.last().hasClass("just-slider__scale-line_large")).toBe(true);
      expect($lines.eq(2).hasClass("just-slider__scale-line_big")).toBe(true);
    });

    test("Sets position styles for segments", () => {
      const mockedPosition = jest.spyOn(Utilities, "getPositionStyles");

      scale.update(modelState);

      const segmentPoints: Array<Segment> = segments.reduce((acc, value) => {
        acc.push(value);
        if (value.type === "number") {
          acc.push({
            value: value.value,
            type: "line",
          });
        }

        return acc;
      }, []);

      segmentPoints.forEach((segment, index) => {
        expect(mockedPosition).toHaveBeenNthCalledWith(index + 1, {
          min:         modelState.min,
          max:         modelState.max,
          orientation: modelState.orientation,
          direction:   modelState.direction,
          shift:       segment.value,
        });
      });

      mockedPosition.mockRestore();
    });
  });
});

