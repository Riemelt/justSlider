import ProgressBar from "./ProgressBar";

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
});
