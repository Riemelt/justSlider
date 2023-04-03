import { JustSliderOptions } from './types';

declare global {
  interface JQuery {
    justSlider(options?: JustSliderOptions): JQuery;
  }
}
