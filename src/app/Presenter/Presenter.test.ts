import EventManager from "../EventManager/EventManager";
import { SliderEvent } from "../EventManager/types";
import Model from "../Model/Model";
import { JustSliderOptions } from "../types";
import { ScaleOptions } from "../View/Scale/types";
import View from "../View/View";
import Presenter from "./Presenter";

describe("Presenter", () => {
  let presenter:    Presenter;
  let eventManager: EventManager;
  let model:        Model;
  let view:         View;

  const onUpdate = jest.fn(() => undefined);

  const scale: ScaleOptions = {
    type:    "steps",
    lines:   true,
    numbers: true,
  };
  
  const options: JustSliderOptions = {
    scale,
    onUpdate,
    from:        0,
    to:          100,
    min:         0,
    max:         100,
    step:        10,
    orientation: "horizontal",
    direction:   "forward",
    range:       false,
    tooltips:    false,
    progressBar: false,
  }

  function buildPresenter() {
    eventManager = new EventManager();
    model        = new Model(eventManager);
    view         = new View(eventManager);
    presenter    = new Presenter(view, model, eventManager);
  }

  beforeEach(() => {
    buildPresenter();
    jest.restoreAllMocks();
  });

  test("Init model", () => {
    const mockedModelInit = jest.spyOn(model, "init");

    presenter.init(options);

    expect(mockedModelInit).toBeCalled();
  });

  test("Init view", () => {
    const mockedViewInit           = jest.spyOn(view, "init");
    const mockedViewInitComponents = jest.spyOn(view, "initComponents");

    presenter.init(options);

    expect(mockedViewInit).toBeCalled();
    expect(mockedViewInitComponents).toBeCalled();
  });

  test("Creates view handlers", () => {
    const mockedViewHandleHandler      = jest.spyOn(view, "addCreateHandleHandlers");
    const mockedViewSliderClickHandler = jest.spyOn(view, "addCreateSliderClickHandler");
    const mockedViewScaleClickHandler  = jest.spyOn(view, "addCreateScaleClickHandler");

    presenter.init(options);

    expect(mockedViewHandleHandler).toBeCalled();
    expect(mockedViewSliderClickHandler).toBeCalled();
    expect(mockedViewScaleClickHandler).toBeCalled();

    const mockedUpdate = jest.spyOn(model, "updateHandle");

    const handleHandler      = mockedViewHandleHandler.mock.calls[0][0];
    const sliderClickHandler = mockedViewSliderClickHandler.mock.calls[0][0];
    const scaleClickHandler  = mockedViewScaleClickHandler.mock.calls[0][0];

    handleHandler(50, "from");
    sliderClickHandler(50, "from");
    scaleClickHandler(50, "from");

    expect(mockedUpdate).toBeCalledTimes(3);
  });

  test("Registers events", () => {
    const mockedRegister = jest.spyOn(eventManager, "registerEvent");
    const events: Array<SliderEvent> = [
      "HandleFromMove",
      "HandleToMove",
      "SliderUpdate",
      "OrientationUpdate",
      "TooltipsUpdate",
      "ProgressBarUpdate",
      "ScaleUpdate",
      "SliderClickDisable",
      "SliderClickEnable",
    ];

    presenter.init(options);
    
    events.forEach(event => {
      expect(mockedRegister).toBeCalledWith(event);
    });
  });

  test("Dispatches events on initialization", () => {
    const mockedDispatch = jest.spyOn(eventManager, "dispatchEvent");
    const events: Array<SliderEvent> = [
      "HandleFromMove",
      "HandleToMove",
      "ProgressBarUpdate",
      "OrientationUpdate",
      "TooltipsUpdate",
      "ScaleUpdate",
      "SliderClickEnable",
      "SliderUpdate",
    ];

    presenter.init(options);

    events.forEach(event => {
      expect(mockedDispatch).toBeCalledWith(event);
    });
  });

  describe("Adds event listeners", () => {
    test("HandleFromMove", () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, "updateHandle");
      eventManager.dispatchEvent("HandleFromMove");

      const type = mockedUpdate.mock.calls[0][1];
      expect(type).toBe("from");
      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test("HandleToMove", () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, "updateHandle");
      eventManager.dispatchEvent("HandleToMove");

      const type = mockedUpdate.mock.calls[0][1];
      expect(type).toBe("to");
      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test("ProgressBarUpdate", () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, "updateProgressBar");
      eventManager.dispatchEvent("ProgressBarUpdate");

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test("OrientationUpdate", () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, "setOrientation");
      eventManager.dispatchEvent("OrientationUpdate");

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test("TooltipsUpdate", () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, "updateTooltips");
      eventManager.dispatchEvent("TooltipsUpdate");

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test("SliderClickEnable", () => {
      presenter.init(options);

      const mockedHandlerSwitch = jest.spyOn(view, "setSliderClickHandler");
      eventManager.dispatchEvent("SliderClickEnable");

      expect(mockedHandlerSwitch).toBeCalledTimes(1);
    });

    test("SliderClickDisable", () => {
      presenter.init(options);

      const mockedHandlerSwitch = jest.spyOn(view, "removeSliderClickHandler");
      eventManager.dispatchEvent("SliderClickDisable");

      expect(mockedHandlerSwitch).toBeCalledTimes(1);
    });

    test("SliderUpdate", () => {
      presenter.init(options);

      onUpdate.mockReset();
      eventManager.dispatchEvent("SliderUpdate");

      expect(onUpdate).toBeCalledTimes(1);
    });

    test("ScaleUpdate", () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, "updateScale");
      eventManager.dispatchEvent("ScaleUpdate");

      expect(mockedUpdate).toBeCalledTimes(1);
    });
  });

  test("Updates a handle", () => {
    const mockedUpdate = jest.spyOn(model, "updateHandle");

    presenter.init(options);
    presenter.updateHandle("from", 50);

    expect(mockedUpdate).toBeCalledWith(50, "from");
  });

  test("Updates options", () => {
    const mockedUpdate = jest.spyOn(model, "updateOptions");
    const newOptions = {
      min: 1000,
      max: 2000,
    };

    presenter.init(options);
    presenter.updateOptions(newOptions);

    expect(mockedUpdate).toBeCalledWith(newOptions);
  });

  test("Returns slider's html node", () => {
    const mockedGetHtml = jest.spyOn(view, "getHtml");

    presenter.init(options);
    const $slider = presenter.$getSlider();

    expect($slider).toEqual(mockedGetHtml.mock.results[0].value);
  });

  test("Returns slider's state", () => {
    const mockedGetState = jest.spyOn(model, "getState");

    presenter.init(options);
    const state = presenter.getState();

    expect(state).toEqual(mockedGetState.mock.results[0].value);
  });
});