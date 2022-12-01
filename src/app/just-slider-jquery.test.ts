import "./just-slider-jquery";
import JustSlider from "./JustSlider/JustSlider";

describe("JustSlider jQuery plugin", () => {
  const $slider: JQuery<HTMLElement> = $(`<div class="slider"></div>`);

  test("justSlider method is defined", () => {
    expect($slider.justSlider).toBeDefined();
  });

  test("Returns JustSlider instance", () => {
    $slider.justSlider();
    const justSlider = $slider.data("just-slider");

    expect(justSlider).toBeInstanceOf(JustSlider);
  });
});