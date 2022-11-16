import "./just-slider-jquery";
import JustSlider from "./JustSlider/JustSlider";

describe("JustSlider jQuery plugin", () => {
  const $slider: JQuery<HTMLElement> = $(`<div class="slider"></div>`);

  test("justSlider method is defined", () => {
    expect($slider.justSlider).toBeDefined();
  });

  test("Returns JustSlider instance", () => {
    const justSlider = $slider.justSlider({});

    expect(justSlider).toBeInstanceOf(JustSlider);
  });
});