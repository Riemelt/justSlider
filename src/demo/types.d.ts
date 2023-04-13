import { SliderDemoOptions } from './components/slider-demo/types';

interface Demos {
  primary: SliderDemoOptions,
  secondary: SliderDemoOptions,
  tertiary: SliderDemoOptions,
  quaternary: SliderDemoOptions,
}

interface DemoOptions {
  demos: Demos;
}

export {
  DemoOptions,
  Demos,
};
