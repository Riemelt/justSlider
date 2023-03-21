import './just-slider-jquery';
import JustSlider from './JustSlider/JustSlider';
import { BACKWARD, VERTICAL } from './Model/constants';
import { JustSliderOptions } from './types';

describe('JustSlider jQuery plugin', () => {
  const options: JustSliderOptions = {
    min: 4,
    max: 20,
    step: 2,
    from: 6,
    to: 8,
    orientation: VERTICAL,
    direction: BACKWARD,
    range: true,
    tooltips: true,
    progressBar: true,
    scale: {
      density: 2,
      numbers: false,
      lines: false,
    },
  };

  const $slider: JQuery<HTMLElement> = $(`
    <div
      class="just-slider"
      data-min="${options.min}"
      data-max="${options.max}"
      data-step="${options.step}"
      data-from="${options.from}"
      data-to="${options.to}"
      data-orientation="${options.orientation}"
      data-direction="${options.direction}"
      data-range="${options.range}"
      data-tooltips="${options.tooltips}"
      data-progress-bar="${options.progressBar}"
      data-scale="${options.scale !== undefined}"
      data-scale-density="${options.scale?.density}"
      data-scale-numbers="${options.scale?.numbers}"
      data-scale-lines="${options.scale?.lines}"
    >
    </div>
  `);

  test('justSlider method is defined', () => {
    expect($slider.justSlider).toBeDefined();
  });

  test('Returns JustSlider instance', () => {
    $slider.justSlider();
    const justSlider = $slider.data('just-slider');

    expect(justSlider).toBeInstanceOf(JustSlider);
  });

  describe('Initializes options with data attributes', () => {
    test('Min', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { min } = justSlider.getState();
      expect(min).toBe(options.min);
    });

    test('Max', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { max } = justSlider.getState();
      expect(max).toBe(options.max);
    });

    test('Step', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { step } = justSlider.getState();
      expect(step).toBe(options.step);
    });

    test('From', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { from } = justSlider.getState();
      expect(from).toBe(options.from);
    });

    test('To', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { to } = justSlider.getState();
      expect(to).toBe(options.to);
    });

    test('Orientation', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { orientation } = justSlider.getState();
      expect(orientation).toBe(options.orientation);
    });

    test('Direction', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { direction } = justSlider.getState();
      expect(direction).toBe(options.direction);
    });

    test('Range', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { range } = justSlider.getState();
      expect(range).toBe(options.range);
    });

    test('Tooltips', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { tooltips } = justSlider.getState();
      expect(tooltips).toBe(options.tooltips);
    });

    test('Progress bar', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { progressBar } = justSlider.getState();
      expect(progressBar).toBe(options.progressBar);
    });

    test('Scale', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { scale } = justSlider.getState();
      expect(scale).not.toBe(null);
    });

    test('Scale density', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { density } = justSlider.getState().scale;
      expect(density).toBe(options.scale?.density);
    });

    test('Scale numbers', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { numbers } = justSlider.getState().scale;
      expect(numbers).toBe(options.scale?.numbers);
    });

    test('Scale lines', () => {
      $slider.justSlider();
      const justSlider = $slider.data('just-slider');

      const { lines } = justSlider.getState().scale;
      expect(lines).toBe(options.scale?.lines);
    });
  });
});
