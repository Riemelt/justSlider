import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  let $parent: JQuery<HTMLElement>;
  let tooltip: Tooltip;

  const tooltipClass = ".just-slider__tooltip";

  beforeEach(() => {
    $parent = $(`<div class="just-slider"></div>`);
    tooltip = new Tooltip($parent);
  });

  test("Creates html node and appends to the parent", () => {
    const $tooltip = $parent.find(tooltipClass);

    expect($tooltip.length).toBe(1);
  });

  test("Deletes html node from parent", () => {
    tooltip.delete();
    const $tooltip = $parent.find(tooltipClass);

    expect($tooltip.length).toBe(0);
  });

  test("Updates value in the html node", () => {
    tooltip.update(5);
    const $tooltip = $parent.find(tooltipClass);

    expect($tooltip.html()).toBe("5");
  });
});


