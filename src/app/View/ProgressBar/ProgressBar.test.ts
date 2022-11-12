import { Direction, Options, Orientation } from "../../types";
import ProgressBar from "./ProgressBar";
import * as Utilities from "../utilities";

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
    const options: Options = { min: -100, max: 300, from: 200, to: 250, range: false, orientation: "horizontal", direction: "forward" };
    let mockedTransform: jest.SpyInstance<string, [options: { shift: number; min: number; max: number; orientation: Orientation; direction: Direction; scale?: number; }]>;

    beforeEach(() => {
      mockedTransform = jest.spyOn(Utilities, "transform");
    });

    afterEach(() => {
      mockedTransform.mockRestore();
    });

    test("Range is false", () => {
      progressBar.update(options);
      expect(mockedTransform).toBeCalledWith({
        min:         options.min,
        max:         options.max,
        orientation: options.orientation,
        direction:   options.direction,
        shift:       options.from,
        scale:       0.75,
      });

      const transformValue = mockedTransform.mock.results[0].value;
      const $progressBar = $parent.find(progressBarClass);
      expect($progressBar.css("transform")).toBe(transformValue);
    });

    test("Range is true", () => {
      progressBar.update({ ...options, range: true, });
      expect(mockedTransform).toBeCalledWith({
        min:         options.min,
        max:         options.max,
        orientation: options.orientation,
        direction:   options.direction,
        shift:       options.to,
        scale:       0.125,
      });

      const transformValue = mockedTransform.mock.results[0].value;
      const $progressBar = $parent.find(progressBarClass);
      expect($progressBar.css("transform")).toBe(transformValue);
    });

    test("Direction is backward", () => {
      progressBar.update({ ...options, direction: "backward", });
      expect(mockedTransform).toBeCalledWith({
        min:         options.min,
        max:         options.max,
        orientation: options.orientation,
        direction:   "backward",
        shift:       options.min,
        scale:       0.75,
      });

      const transformValue = mockedTransform.mock.results[0].value;
      const $progressBar = $parent.find(progressBarClass);
      expect($progressBar.css("transform")).toBe(transformValue);
    });
  });
});
