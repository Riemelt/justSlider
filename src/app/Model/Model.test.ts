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

  test("Returns options", () => {
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
    const modelOptions = model.getOptions();

    expect(modelOptions).toEqual(options);
  });
  
  test("Init with default values", () => {
    model.init();
    const modelOptions = model.getOptions();

    expect(modelOptions.from).toBeDefined();
    expect(modelOptions.to).toBeDefined();
    expect(modelOptions.min).toBeDefined();
    expect(modelOptions.max).toBeDefined();
    expect(modelOptions.step).toBeDefined();
    expect(modelOptions.orientation).toBeDefined();
    expect(modelOptions.direction).toBeDefined();
    expect(modelOptions.range).toBeDefined();
    expect(modelOptions.tooltips).toBeDefined();
    expect(modelOptions.progressBar).toBeDefined();
  });

  describe("Tooltips", () => {
    test("Updates tooltips", () => {
      model.init({ tooltips: false });
      model.updateOptions({ tooltips: true });

      const modelOptions = model.getOptions();

      expect(modelOptions.tooltips).toBe(true);
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

      const modelOptions = model.getOptions();

      expect(modelOptions.progressBar).toBe(true);
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

      const modelOptions = model.getOptions();

      expect(modelOptions.direction).toBe("backward");
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"];

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

      const modelOptions = model.getOptions();

      expect(modelOptions.orientation).toBe("vertical");
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

      const modelOptions = model.getOptions();

      expect(modelOptions.range).toBe(true);
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
      const modelOptions = model.getOptions();

      expect(modelOptions.to).toBeGreaterThanOrEqual(80);
    });
  });

  describe("Min and max", () => {
    test("Swaps values if min is greater than max", () => {
      model.init({ min: 20, max: 0 });
      const modelOptions = model.getOptions();

      expect(modelOptions.min).toBe(0);
      expect(modelOptions.max).toBe(20);
    })

    test("Adjust step value on update, if it's not valid", () => {
      model.init({ min: 0, max: 100 , step: 10});
      model.updateOptions({ max: 5 });

      const modelOptions = model.getOptions();

      expect(modelOptions.step).toBeLessThanOrEqual(5);
    })

    test("Adjust handle values on update, if they are not valid", () => {
      model.init({ min: 0, max: 100, from: 20, to: 50, range: true });
      model.updateOptions({ min: 30, max: 40 });

      const modelOptions = model.getOptions();

      expect(modelOptions.from).toBeGreaterThanOrEqual(30);
      expect(modelOptions.to).toBeLessThanOrEqual(40);
    })

    test("Updates min", () => {
      model.init({ min: 20 });
      model.updateOptions({ min: 50 });

      const modelOptions = model.getOptions();

      expect(modelOptions.min).toBe(50);
    });

    test("Updates max", () => {
      model.init({ max: 120 });
      model.updateOptions({ max: 150 });

      const modelOptions = model.getOptions();

      expect(modelOptions.max).toBe(150);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"];

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
      const modelOptions = model.getOptions();

      expect(modelOptions.step).toBeLessThanOrEqual(10);
    });

    test("Cannot be less than 0 or equal", () => {
      model.init({ min: 0, max: 10, step: 0 });

      let modelOptions = model.getOptions();
      expect(modelOptions.step).toBeGreaterThan(0);

      model.updateOptions({ step: -1 });
      modelOptions = model.getOptions();
      expect(modelOptions.step).toBeGreaterThan(0);
    });

    test("Adjust handle values on update, if they are not valid", () => {
      model.init({ min: 0, max: 100, from: 20, to: 50, step: 10, range: true });
      model.updateOptions({ step: 3 });

      const { from, to } = model.getOptions();

      expect(from % 3).toBe(0);
      expect(to % 3).toBe(0);
    });

    test("Updates step", () => {
      model.init({ step: 10 });
      model.updateOptions({ step: 8 });

      const modelOptions = model.getOptions();

      expect(modelOptions.step).toBe(8);
    });

    test("Dispatches events on update", () => {
      const mockedDispatcher = jest.spyOn(eventManager, "dispatchEvent");
      const events: Array<SliderEvent> = ["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "SliderUpdate"];

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
      const { from } = model.getOptions();
      expect(from).toBeLessThanOrEqual(100);
    });

    test("Cannot be less than min", () => {
      model.init({ ...options, from: -120 });
      const { from } = model.getOptions();
      expect(from).toBeGreaterThanOrEqual(0);
    });

    test("Adjust value depending on step property (no remainder when divided by step)", () => {
      model.init({ ...options, step: 3, from: 10 });

      const { from } = model.getOptions();
      expect(from % 3).toBe(0);
    });

    test("HandleFrom cannot be greater than HandleTo", () => {
      model.init({ ...options, range: true, from: 10, to: 5 });
      const { from, to } = model.getOptions();

      expect(from).toBeLessThanOrEqual(to);
    });

    test("If range is false, HandleFrom - HandleTo collision is disabled", () => {
      model.init({ ...options, range: false, from: 10, to: 5 });
      const { from, to } = model.getOptions();

      expect(to).toBe(5);
      expect(from).toBe(10);
    });

    test("Updates HandleFrom", () => {
      model.init({ ...options, from: 10 });
      model.updateHandle(20, "from");

      const modelOptions = model.getOptions();

      expect(modelOptions.from).toBe(20);
    });

    test("Updates HandleTo", () => {
      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateHandle(50, "to");

      const modelOptions = model.getOptions();

      expect(modelOptions.to).toBe(50);
    });

    test("Updates handles with universal update method", () => {
      model.init({ ...options, range: true, from: 0, to: 10 });
      model.updateOptions({ from: 25, to: 50 });

      const modelOptions = model.getOptions();

      expect(modelOptions.from).toBe(25);
      expect(modelOptions.to).toBe(50);
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
});