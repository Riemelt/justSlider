import { Options, JustSlider } from "./types";

declare global {
  interface JQuery {
    justSlider: (options: Options) => JustSlider;
  }
}