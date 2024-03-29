import { Options } from '../types';
import { LINE, NUMBER } from '../View/Scale/constants';
import {
  BACKWARD,
  FORWARD,
  FROM,
  HORIZONTAL,
  TO,
  VERTICAL,
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  ORIENTATION_UPDATE,
  PROGRESS_BAR_UPDATE,
  SCALE_UPDATE,
  SLIDER_UPDATE,
  TOOLTIPS_UPDATE,
} from './constants';
import Model from './Model';
import { ModelEvent } from './types';

describe('Model', () => {
  let model: Model;

  beforeEach(() => {
    model = new Model();
  });

  test('Returns state', () => {
    const options: Options = {
      from: 200,
      to: 250,
      step: 10,
      min: -100,
      max: 300,
      orientation: HORIZONTAL,
      direction: FORWARD,
      range: true,
      tooltips: false,
      progressBar: true,
    };

    model.init(options);
    const state = model.getState();

    expect(state).toBeDefined();
  });

  test('Init with default values', () => {
    model.init();
    const state = model.getState();

    expect(state.from).toBeDefined();
    expect(state.to).toBeDefined();
    expect(state.min).toBeDefined();
    expect(state.max).toBeDefined();
    expect(state.step).toBeDefined();
    expect(state.orientation).toBeDefined();
    expect(state.direction).toBeDefined();
    expect(state.range).toBeDefined();
    expect(state.tooltips).toBeDefined();
    expect(state.progressBar).toBeDefined();
    expect(state.scale).toBeDefined();
    expect(state.precision).toBeDefined();
  });

  describe('Tooltips', () => {
    test('Updates tooltips', () => {
      model.init({ tooltips: false });
      model.updateOptions({ tooltips: true });

      const state = model.getState();

      expect(state.tooltips).toBe(true);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [TOOLTIPS_UPDATE, SLIDER_UPDATE];

      model.init({ tooltips: false });
      model.updateOptions({ tooltips: true });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe('Progress bar', () => {
    test('Updates progress bar', () => {
      model.init({ progressBar: false });
      model.updateOptions({ progressBar: true });

      const state = model.getState();

      expect(state.progressBar).toBe(true);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [PROGRESS_BAR_UPDATE, SLIDER_UPDATE];

      model.init({ progressBar: false });
      model.updateOptions({ progressBar: true });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe('Direction', () => {
    test('Updates direction', () => {
      model.init({ direction: FORWARD });
      model.updateOptions({ direction: BACKWARD });

      const state = model.getState();

      expect(state.direction).toBe(BACKWARD);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        HANDLE_FROM_MOVE,
        HANDLE_TO_MOVE,
        PROGRESS_BAR_UPDATE,
        SCALE_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ direction: FORWARD });
      model.updateOptions({ direction: BACKWARD });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe('Orientation', () => {
    test('Updates orientation', () => {
      model.init({ orientation: HORIZONTAL });
      model.updateOptions({ orientation: VERTICAL });

      const state = model.getState();

      expect(state.orientation).toBe(VERTICAL);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        ORIENTATION_UPDATE,
        SCALE_UPDATE,
        HANDLE_FROM_MOVE,
        HANDLE_TO_MOVE,
        PROGRESS_BAR_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ orientation: HORIZONTAL });
      model.updateOptions({ orientation: VERTICAL });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe('Range', () => {
    test('Updates range', () => {
      model.init({ range: false });
      model.updateOptions({ range: true });

      const state = model.getState();

      expect(state.range).toBe(true);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        HANDLE_FROM_MOVE,
        HANDLE_TO_MOVE,
        PROGRESS_BAR_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ range: false });
      model.updateOptions({ range: true });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });

    test(
      'Adjust handle value when switching range to true, if it\'s not valid',
      () => {
        const initOptions = {
          from: 50,
          to: 70,
          min: 0,
          max: 100,
          range: false,
        };

        model.init(initOptions);
        model.updateHandle(80, FROM);

        model.updateOptions({ range: true });
        const state = model.getState();

        expect(state.to).toBeGreaterThanOrEqual(70);
      }
    );
  });

  describe('Min and max', () => {
    test('Swaps values if min is greater than max', () => {
      model.init({ min: 20, max: 0 });
      const state = model.getState();

      expect(state.min).toBe(0);
      expect(state.max).toBe(20);
    });

    test('Min and max cannot be equal', () => {
      model.init({ min: 0, max: 0 });
      const state = model.getState();

      expect(state.min).not.toBe(state.max);
    });

    test('Adjust step value on update, if it\'s not valid', () => {
      model.init({ min: 0, max: 100, step: 10 });
      model.updateOptions({ max: 5 });

      const state = model.getState();

      expect(state.step).toBeLessThanOrEqual(5);
    });

    test('Adjust handle values on update, if they are not valid', () => {
      model.init({ min: 0, max: 100, from: 20, to: 50, range: true });
      model.updateOptions({ min: 30, max: 40 });

      const state = model.getState();

      expect(state.from).toBeGreaterThanOrEqual(30);
      expect(state.to).toBeLessThanOrEqual(40);
    });

    test('Updates min', () => {
      model.init({ min: 20 });
      model.updateOptions({ min: 50 });

      const state = model.getState();

      expect(state.min).toBe(50);
    });

    test('Updates max', () => {
      model.init({ max: 120 });
      model.updateOptions({ max: 150 });

      const state = model.getState();

      expect(state.max).toBe(150);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        SCALE_UPDATE,
        HANDLE_FROM_MOVE,
        HANDLE_TO_MOVE,
        PROGRESS_BAR_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ min: 20 });
      model.updateOptions({ min: 50 });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe('Step', () => {
    test('Cannot be greater than slider range', () => {
      model.init({ min: 0, max: 10, step: 11 });
      const state = model.getState();

      expect(state.step).toBeLessThanOrEqual(10);
    });

    test('Cannot be less than 0 or equal', () => {
      model.init({ min: 0, max: 10, step: 0 });

      let state = model.getState();
      expect(state.step).toBeGreaterThan(0);

      model.updateOptions({ step: -1 });
      state = model.getState();
      expect(state.step).toBeGreaterThan(0);
    });

    test('Adjust handle values on update, if they are not valid', () => {
      model.init({ min: 0, max: 100, from: 20, to: 50, step: 10, range: true });
      model.updateOptions({ step: 3 });

      const { from, to } = model.getState();

      expect(from % 3).toBe(0);
      expect(to % 3).toBe(0);
    });

    test('Updates step', () => {
      model.init({ step: 10 });
      model.updateOptions({ step: 8 });

      const state = model.getState();

      expect(state.step).toBe(8);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        SCALE_UPDATE,
        HANDLE_FROM_MOVE,
        HANDLE_TO_MOVE,
        PROGRESS_BAR_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ step: 10 });
      model.updateOptions({ step: 8 });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe('Handles', () => {
    const options: Options = {
      min: 0,
      max: 100,
      step: 1,
      range: false,
    };

    test('Cannot be greater than max', () => {
      model.init({ ...options, from: 120 });
      const { from } = model.getState();
      expect(from).toBeLessThanOrEqual(100);
    });

    test('Cannot be less than min', () => {
      model.init({ ...options, from: -120 });
      const { from } = model.getState();
      expect(from).toBeGreaterThanOrEqual(0);
    });

    test('Adjust value depending on step property (no remainder)', () => {
      model.init({ ...options, step: 3, from: 10 });

      const { from } = model.getState();
      expect(from % 3).toBe(0);
    });

    test('HandleFrom cannot be greater than HandleTo', () => {
      model.init({ ...options, range: true, from: 10, to: 5 });
      const { from, to } = model.getState();

      expect(from).toBeLessThanOrEqual(to);
    });

    test('If range is false, handles collision is disabled', () => {
      model.init({ ...options, range: false, from: 10, to: 5 });
      const { from, to } = model.getState();

      expect(to).toBe(5);
      expect(from).toBe(10);
    });

    test('Updates HandleFrom', () => {
      model.init({ ...options, from: 10 });
      model.updateHandle(20, FROM);

      const state = model.getState();

      expect(state.from).toBe(20);
    });

    test('Updates HandleTo', () => {
      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateHandle(50, TO);

      const state = model.getState();

      expect(state.to).toBe(50);
    });

    test('Updates handles with universal update method', () => {
      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateOptions({ from: 25, to: 50 });

      const state = model.getState();

      expect(state.from).toBe(25);
      expect(state.to).toBe(50);
    });

    test('Swaps handles if they collide', () => {
      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateHandle(30, FROM);

      const state = model.getState();

      expect(state.from).toBe(10);
      expect(state.to).toBe(30);
    });

    test('Dispatches events on handle from update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        HANDLE_FROM_MOVE,
        HANDLE_TO_MOVE,
        PROGRESS_BAR_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ ...options, range: true, from: 0, to: 30 });
      model.updateHandle(25, FROM);

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });

    test('Dispatches events on handle to update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        HANDLE_TO_MOVE,
        HANDLE_FROM_MOVE,
        PROGRESS_BAR_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateHandle(50, TO);

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe('Scale', () => {
    test('Init with default values', () => {
      model.init({ scale: {} });

      const { scale } = model.getState();

      expect(scale?.density).toBeDefined();
      expect(scale?.numbers).toBeDefined();
      expect(scale?.lines).toBeDefined();
    });

    test('Updates scale', () => {
      model.init({ scale: { numbers: false } });
      model.updateOptions({ scale: { numbers: true } });

      const state = model.getState();

      expect(state.scale?.numbers).toBe(true);
    });

    test('Dispatches events on update', () => {
      const mockedDispatcher = jest.spyOn(model, 'dispatchEvent');
      const events: Array<ModelEvent> = [
        SCALE_UPDATE,
        TOOLTIPS_UPDATE,
        SLIDER_UPDATE,
      ];

      model.init({ scale: { numbers: false } });
      model.updateOptions({ scale: { numbers: true } });

      events.forEach((event, index) => {
        expect(mockedDispatcher.mock.calls[index][0]).toBe(event);
      });

      mockedDispatcher.mockRestore();
    });

    test('Density cannot be less than 0.5', () => {
      model.init({ scale: {
        density: 0.1,
      } });

      const state = model.getState();
      expect(state.scale?.density).toBeGreaterThanOrEqual(0.5);
    });

    test('Density cannot be greater than 100', () => {
      model.init({ scale: {
        density: 200,
      } });

      const state = model.getState();
      expect(state.scale?.density).toBeLessThanOrEqual(100);
    });

    test('Generates segments', () => {
      model.init({
        min: 0,
        max: 20,
        step: 10,
        scale: {
          density: 15,
        },
      });

      const state = model.getState();
      expect(state.scale?.segments).toEqual([
        {
          type: NUMBER,
          value: 0,
        },
        {
          type: LINE,
          value: 2.5,
        },
        {
          type: LINE,
          value: 5,
        },
        {
          type: LINE,
          value: 7.5,
        },
        {
          type: NUMBER,
          value: 10,
        },
        {
          type: LINE,
          value: 12.5,
        },
        {
          type: LINE,
          value: 15,
        },
        {
          type: LINE,
          value: 17.5,
        },
        {
          type: NUMBER,
          value: 20,
        },
      ]);
    });

    test('Amount of number segments cannot be more than 100', () => {
      model.init({
        min: 0,
        max: 1000,
        step: 1,
        scale: {
          density: 15,
        },
      });

      const state = model.getState();
      const segments = state.scale?.segments;
      const numbers = segments?.filter((segment) => segment.type === NUMBER);

      expect(numbers?.length).not.toBeGreaterThan(100);
    });
  });

  describe('Precision', () => {
    test('Updates precision', () => {
      model.init();
      model.updateOptions({ min: 0, max: 2.222, step: 0.5 });

      const state = model.getState();

      expect(state.precision).toBe(3);
    });

    test('Cannot be less than precision of min, max or step', () => {
      model.init({ min: 0, max: 2.22, step: 0.5 });
      const state = model.getState();

      expect(state.precision).toBeGreaterThanOrEqual(2);
    });
  });
});
