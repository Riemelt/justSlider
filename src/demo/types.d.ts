import {
  SliderDemoOptions,
} from "./components/slider-demo/types";

interface DemoOptions {
  demos: {
    primary:    SliderDemoOptions,
    secondary:  SliderDemoOptions,
    tertiary:   SliderDemoOptions,
    quaternary: SliderDemoOptions,
  };
}

export {
  DemoOptions,
}