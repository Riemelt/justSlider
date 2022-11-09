import { JustSlider, JustSliderOptions } from "./types";

declare global {
  interface JQuery {
    justSlider: (options: JustSliderOptions) => JustSlider;
  }
}