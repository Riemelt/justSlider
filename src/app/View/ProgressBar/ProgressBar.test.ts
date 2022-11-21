import {
  Direction,
  State,
  Orientation
} from "../../types";

import ProgressBar from "./ProgressBar";
import * as Utilities from "../utilities/utilities";

describe("ProgressBar", () => {
  let $parent:     JQuery<HTMLElement>;
  let progressBar: ProgressBar;

  const progressBarClass = ".just-slider__progress-bar";

  beforeEach(() => {
    $parent = $(`<div class="just-slider"></div>`);
    progressBar = new ProgressBar($parent);
  });

  test("Creates html node and appends to the parent", () => {
    const $progressBar = $parent.find(progressBarClass);

    expect($progressBar.length).toBe(1);
  });

  test("Deletes html node from parent", () => {
    progressBar.delete();
    const $progressBar = $parent.find(progressBarClass);

    expect($progressBar.length).toBe(0);
  });

  describe("Updates transform styles", () => {
    const state: State = {
      min:         -100,
      max:         300,
      from:        200,
      to:          250,
      range:       false,
      orientation: "horizontal",
      direction:   "forward",
    };
    let mockedTransform: jest.SpyInstance<{ property: string; style: string; }, [options: { shift: number; min: number; max: number; orientation: Orientation; direction: Direction; scale?: number; }]>;

    beforeEach(() => {
      mockedTransform = jest.spyOn(Utilities, "getTransformStyles");
    });

    afterEach(() => {
      mockedTransform.mockRestore();
    });

    test("Range is false", () => {
      progressBar.update(state);
      expect(mockedTransform).toBeCalledWith({
        min:         state.min,
        max:         state.max,
        orientation: state.orientation,
        direction:   state.direction,
        shift:       state.from,
        scale:       0.75,
      });

      const { property, style } = mockedTransform.mock.results[0].value;
      const $progressBar = $parent.find(progressBarClass);
      expect($progressBar.css(property)).toBe(style);
    });

    test("Range is true", () => {
      progressBar.update({ ...state, range: true, });
      expect(mockedTransform).toBeCalledWith({
        min:         state.min,
        max:         state.max,
        orientation: state.orientation,
        direction:   state.direction,
        shift:       state.to,
        scale:       0.125,
      });

      const { property, style } = mockedTransform.mock.results[0].value;
      const $progressBar = $parent.find(progressBarClass);
      expect($progressBar.css(property)).toBe(style);
    });

    test("Direction is backward", () => {
      progressBar.update({ ...state, direction: "backward", });
      expect(mockedTransform).toBeCalledWith({
        min:         state.min,
        max:         state.max,
        orientation: state.orientation,
        direction:   "backward",
        shift:       state.min,
        scale:       0.75,
      });

      const { property, style } = mockedTransform.mock.results[0].value;
      const $progressBar = $parent.find(progressBarClass);
      expect($progressBar.css(property)).toBe(style);
    });
  });
});
