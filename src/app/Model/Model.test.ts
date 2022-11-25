import EventManager from "../EventManager/EventManager";
import { SliderEvent } from "../EventManager/types";
import { Options } from "../types";
import Model from "./Model";

describe("Model", () => {
  let model: Model;
  let eventManager: EventManager;

  beforeEach(() => {
    eventManager = new EventManager();
    model        = new Model(eventManager)  
  });

  test("Returns state", () => {
    const options:    Options = {
      from:        200,
      to:          250,
      step:        10,
      min:         -100,
      max:         300,
      orientation: "horizontal",
      direction:   "forward",
      range:       true,
      tooltips:    false,
      progressBar: true,
    };

    model.init(options);
    const state = model.getState();

    expect(state).toBeDefined();
  });
  
  test("Init with default values", () => {
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

  describe("Tooltips", () => {
    test("Updates tooltips", () => {
      model.init({ tooltips: false });
      model.updateOptions({ tooltips: true });

      const state = model.getState();

      expect(state.tooltips).toBe(true);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["TooltipsUpdate", "SliderUpdate"];

      model.init({ tooltips: false });
      model.updateOptions({ tooltips: true });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe("Progress bar", () => {
    test("Updates progress bar", () => {
      model.init({ progressBar: false });
      model.updateOptions({ progressBar: true });

      const state = model.getState();

      expect(state.progressBar).toBe(true);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["ProgressBarUpdate", "SliderUpdate"];

      model.init({ progressBar: false });
      model.updateOptions({ progressBar: true });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe("Direction", () => {
    test("Updates direction", () => {
      model.init({ direction: "forward" });
      model.updateOptions({ direction: "backward" });

      const state = model.getState();

      expect(state.direction).toBe("backward");
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "ScaleUpdate", "SliderUpdate"];

      model.init({ direction: "forward" });
      model.updateOptions({ direction: "backward" });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe("Orientation", () => {
    test("Updates orientation", () => {
      model.init({ orientation: "horizontal" });
      model.updateOptions({ orientation: "vertical" });

      const state = model.getState();

      expect(state.orientation).toBe("vertical");
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["OrientationUpdate", "HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"];

      model.init({ orientation: "horizontal" });
      model.updateOptions({ orientation: "vertical" });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe("Range", () => {
    test("Updates range", () => {
      model.init({ range: false });
      model.updateOptions({ range: true });

      const state = model.getState();

      expect(state.range).toBe(true);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleToMove", "ProgressBarUpdate", "SliderUpdate"];

      model.init({ range: false });
      model.updateOptions({ range: true });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });

    test("Adjust HandleTo value when switching range to true, if it's not valid", () => {
      const initOptions = {
        from:  50,
        to:    70,
        min:   0,
        max:   100,
        range: false,
      };

      model.init(initOptions);
      model.updateHandle(80, "from");

      model.updateOptions({ range: true });
      const state = model.getState();

      expect(state.to).toBeGreaterThanOrEqual(80);
    });
  });

  describe("Min and max", () => {
    test("Swaps values if min is greater than max", () => {
      model.init({ min: 20, max: 0 });
      const state = model.getState();

      expect(state.min).toBe(0);
      expect(state.max).toBe(20);
    })

    test("Adjust step value on update, if it's not valid", () => {
      model.init({ min: 0, max: 100 , step: 10});
      model.updateOptions({ max: 5 });

      const state = model.getState();

      expect(state.step).toBeLessThanOrEqual(5);
    })

    test("Adjust handle values on update, if they are not valid", () => {
      model.init({ min: 0, max: 100, from: 20, to: 50, range: true });
      model.updateOptions({ min: 30, max: 40 });

      const state = model.getState();

      expect(state.from).toBeGreaterThanOrEqual(30);
      expect(state.to).toBeLessThanOrEqual(40);
    })

    test("Updates min", () => {
      model.init({ min: 20 });
      model.updateOptions({ min: 50 });

      const state = model.getState();

      expect(state.min).toBe(50);
    });

    test("Updates max", () => {
      model.init({ max: 120 });
      model.updateOptions({ max: 150 });

      const state = model.getState();

      expect(state.max).toBe(150);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "ScaleUpdate", "SliderUpdate"];

      model.init({ min: 20 });
      model.updateOptions({ min: 50 });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe("Step", () => {
    test("Cannot be greater than slider range", () => {
      model.init({ min: 0, max: 10, step: 11 });
      const state = model.getState();

      expect(state.step).toBeLessThanOrEqual(10);
    });

    test("Cannot be less than 0 or equal", () => {
      model.init({ min: 0, max: 10, step: 0 });

      let state = model.getState();
      expect(state.step).toBeGreaterThan(0);

      model.updateOptions({ step: -1 });
      state = model.getState();
      expect(state.step).toBeGreaterThan(0);
    });

    test("Adjust handle values on update, if they are not valid", () => {
      model.init({ min: 0, max: 100, from: 20, to: 50, step: 10, range: true });
      model.updateOptions({ step: 3 });

      const { from, to } = model.getState();

      expect(from % 3).toBe(0);
      expect(to % 3).toBe(0);
    });

    test("Updates step", () => {
      model.init({ step: 10 });
      model.updateOptions({ step: 8 });

      const state = model.getState();

      expect(state.step).toBe(8);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "ScaleUpdate", "SliderUpdate"];

      model.init({ step: 10 });
      model.updateOptions({ step: 8 });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe("Handles", () => {
    const options: Options = {
      min: 0,
      max: 100,
      step: 1,
      range: false,
    };

    test("Cannot be greater than max", () => {
      model.init({ ...options, from: 120 });
      const { from } = model.getState();
      expect(from).toBeLessThanOrEqual(100);
    });

    test("Cannot be less than min", () => {
      model.init({ ...options, from: -120 });
      const { from } = model.getState();
      expect(from).toBeGreaterThanOrEqual(0);
    });

    test("Adjust value depending on step property (no remainder when divided by step)", () => {
      model.init({ ...options, step: 3, from: 10 });

      const { from } = model.getState();
      expect(from % 3).toBe(0);
    });

    test("HandleFrom cannot be greater than HandleTo", () => {
      model.init({ ...options, range: true, from: 10, to: 5 });
      const { from, to } = model.getState();

      expect(from).toBeLessThanOrEqual(to);
    });

    test("If range is false, HandleFrom - HandleTo collision is disabled", () => {
      model.init({ ...options, range: false, from: 10, to: 5 });
      const { from, to } = model.getState();

      expect(to).toBe(5);
      expect(from).toBe(10);
    });

    test("Updates HandleFrom", () => {
      model.init({ ...options, from: 10 });
      model.updateHandle(20, "from");

      const state = model.getState();

      expect(state.from).toBe(20);
    });

    test("Updates HandleTo", () => {
      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateHandle(50, "to");

      const state = model.getState();

      expect(state.to).toBe(50);
    });

    test("Updates handles with universal update method", () => {
      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateOptions({ from: 25, to: 50 });

      const state = model.getState();

      expect(state.from).toBe(25);
      expect(state.to).toBe(50);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"];

      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateHandle(25, "from");
      model.updateHandle(50, "to");

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });

  describe("Scale", () => {
    test("Init with default values", () => {
      model.init({ scale: {}});

      const { scale } = model.getState();

      expect(scale.density).toBeDefined();
      expect(scale.type).toBeDefined();
      expect(scale.set).toBeDefined();
      expect(scale.numbers).toBeDefined();
      expect(scale.lines).toBeDefined();
    });

    test("Updates scale", () => {
      model.init({ scale: { type: "steps" } });
      model.updateOptions({ scale: { type: "set" } });

      const state = model.getState();

      expect(state.scale.type).toBe("set");
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["ScaleUpdate", "SliderUpdate"];

      model.init({ scale: { type: "steps" } });
      model.updateOptions({ scale: { type: "set" } });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });

    test("Density cannot be less than 0", () => {
      model.init({ scale: {
        density: -30,
      }});

      const state = model.getState();
      expect(state.scale.density).toBeGreaterThanOrEqual(0);
    });

    test("Density cannot be greater than 100", () => {
      model.init({ scale: {
        density: 200,
      }});

      const state = model.getState();
      expect(state.scale.density).toBeLessThanOrEqual(100);
    });

    test("Set should contain 0 and 100 in the beginning and in the end respectively", () => {
      model.init({ scale: {
        set: [50],
      }});

      const state = model.getState();
      expect(state.scale.set).toEqual([0, 50, 100]);
    });

    test("Set values cannot be greater than 100 or less than 0", () => {
      model.init({ scale: {
        set: [-20, 50, 300],
      }});

      const state = model.getState();
      state.scale.set.forEach(value => {
        expect(value).toBeLessThanOrEqual(100);
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    test("Set values are unique", () => {
      model.init({ scale: {
        set: [10, 20, 10],
      }});

      const state = model.getState();
      expect(state.scale.set).toEqual([0, 10, 20, 100]);
    });

    test("Set values are sorted", () => {
      model.init({ scale: {
        set: [10, 20, 15],
      }});

      const state = model.getState();
      expect(state.scale.set).toEqual([0, 10, 15, 20, 100]);
    });

    test("Generates segments, steps mode", () => {
      model.init({
        min: 0,
        max: 20,
        step: 10,
        scale: {
          type: "steps",
          density: 15,
      }});

      const state = model.getState();
      expect(state.scale.segments).toEqual([
        {
          type: "number",
          value: 0,
        },
        {
          type: "line",
          value: 2.5,
        },
        {
          type: "line",
          value: 5,
        },
        {
          type: "line",
          value: 7.5,
        },
        {
          type: "number",
          value: 10,
        },
        {
          type: "line",
          value: 12.5,
        },
        {
          type: "line",
          value: 15,
        },
        {
          type: "line",
          value: 17.5,
        },
        {
          type: "number",
          value: 20,
        },
      ]);
    });

    test("Generates segments, set mode", () => {
      model.init({
        min: 0,
        max: 100,
        step: 10,
        scale: {
          type: "set",
          density: 15,
          set: [0, 20, 80, 100],
      }});

      const state = model.getState();
      expect(state.scale.segments).toEqual([
        {
          type: "number",
          value: 0,
        },
        {
          type: "line",
          value: 10,
        },
        {
          type: "number",
          value: 20,
        },
        {
          type: "line",
          value: 35,
        },
        {
          type: "line",
          value: 50,
        },
        {
          type: "line",
          value: 65,
        },
        {
          type: "number",
          value: 80,
        },
        {
          type: "line",
          value: 90,
        },
        {
          type: "number",
          value: 100,
        },
      ]);
    });
  });

  describe("Precision", () => {
    test("Updates precision", () => {
      model.init({ precision: 1 });
      model.updateOptions({ precision: 2 });

      const state = model.getState();

      expect(state.precision).toBe(2);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["TooltipsUpdate", "ScaleUpdate", "SliderUpdate"];

      model.init({ precision: 1 });
      model.updateOptions({ precision: 2 });

      events.forEach(event => {
        expect(mockedDispatcher).toBeCalledWith(event);
      });

      mockedDispatcher.mockRestore();
    });
  });
});