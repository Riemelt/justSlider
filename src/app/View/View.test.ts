import EventManager   from "../EventManager/EventManager";
import { State }      from "../types";
import View           from "./View";
import Handle         from "./Handle/Handle";
import ProgressBar    from "./ProgressBar/ProgressBar";
import Scale          from "./Scale/Scale";
import * as Utilities from "./utilities";
import {
  ScaleState,
} from "./Scale/types";

describe("View", () => {
  let eventManager: EventManager;
  let view:         View;

  const scale: ScaleState = {
    segments: [],
    lines:    true,
    numbers:  true,
  };

  const state:      State = {
    scale,
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

  beforeEach(() => {
    eventManager = new EventManager();
    view         = new View(eventManager);
  });

  describe("On initialization", () => {
    test("Generates html node", () => {
      view.init(state);
  
      const $html = view.getHtml();
      expect($html.is(".just-slider"));
  
      const $main = $html.find(".just-slider__main");
      expect($main.length).toBe(1);
    });
  });

  test("Sets vertical orientation", () => {
    view.init(state);
    view.setOrientation("vertical");

    const $html = view.getHtml();
    expect($html.hasClass("just-slider_vertical")).toBe(true);
  });

  test("Unsets vertical orientation", () => {
    view.init(state);
    view.setOrientation("vertical");
    view.setOrientation("horizontal");

    const $html = view.getHtml();
    expect($html.hasClass("just-slider_vertical")).toBe(false);
  });

  describe("Handles", () => {
    describe("Updates HandleTo", () => {
      test("Creates and updates HandleTo if range is true", () => {
        const mockedUpdate     = jest.spyOn(Handle.prototype, "update");
        const mockedSetHandler = jest.spyOn(Handle.prototype, "setHandleMousemoveHandler");
  
        view.init(state);
        view.addCreateHandleHandlers(() => undefined);
        view.updateHandleTo(state);
  
        expect(mockedSetHandler).toBeCalledTimes(1);
        expect(mockedUpdate).toBeCalledTimes(1);
  
        mockedSetHandler.mockRestore();
        mockedUpdate.mockRestore();
      });
  
      test("Deletes HandleTo if range is false", () => {
        const mockedHandleDelete = jest.spyOn(view, "deleteHandle");
  
        view.init(state);
        view.addCreateHandleHandlers(() => undefined);
        view.updateHandleTo(state);
        view.updateHandleTo({ ...state, range: false});
  
        expect(mockedHandleDelete).toBeCalledTimes(1);
        expect(mockedHandleDelete).toBeCalledWith("to");
  
        mockedHandleDelete.mockRestore();
      });
    });

    test("Creates handle mousemove handler", () => {
      const mockedHandler = jest.fn(() => undefined);
      const mockedSetHandler = jest.spyOn(Handle.prototype, "setHandleMousemoveHandler");
      const mockedConvertPosition = jest.spyOn(Utilities, "convertViewPositionToModel");
  
      view.init(state);
      view.addCreateHandleHandlers(mockedHandler);
      view.initComponents();

      const $html = view.getHtml();
      const $justSlider = $html.find(".just-slider__main");

      const mockedOffset = jest.spyOn(jQuery.fn, "offset").mockImplementation(() => {
        return { left: 150, top: 250, };
      });

      $justSlider.width(1000);
  
      const handler = mockedSetHandler.mock.calls[0][0];
      handler(250, "from");

      expect(mockedConvertPosition).toBeCalledWith({
        position:    250,
        shift:       150,
        length:      1000,
        min:         state.min,
        max:         state.max,
        orientation: state.orientation,
        direction:   state.direction,
      });

      const convertedPosition = mockedConvertPosition.mock.results[0].value;
  
      expect(mockedHandler).toBeCalledWith(convertedPosition, "from");
  
      mockedOffset.mockRestore();
      mockedConvertPosition.mockRestore();
      mockedSetHandler.mockRestore();
    });
  
    test("Updates HandleFrom", () => {
      const mockedUpdate = jest.spyOn(Handle.prototype, "update");
  
      view.init(state);
      view.addCreateHandleHandlers(() => undefined);
      view.initComponents();
      view.updateHandleFrom(state);
  
      expect(mockedUpdate).toBeCalledTimes(1);
      mockedUpdate.mockRestore();
    });

    test("Deletes a handle", () => { 
      const mockedHandleDelete = jest.spyOn(Handle.prototype, "delete");
  
      view.init(state);
      view.addCreateHandleHandlers(() => undefined);
      view.initComponents();
      view.deleteHandle("from");
  
      expect(mockedHandleDelete).toBeCalledTimes(1);
  
      mockedHandleDelete.mockRestore();
    });
  });

  test("Updates tooltips", () => {
    const mockedUpdateTooltip = jest.spyOn(Handle.prototype, "updateTooltip");

    view.init(state);
    view.addCreateHandleHandlers(() => undefined);
    view.initComponents();

    view.updateHandleTo(state);
    view.updateTooltips(state);

    expect(mockedUpdateTooltip).toBeCalledTimes(3);

    mockedUpdateTooltip.mockRestore();
  });

  describe("Progress bar", () => {
    test("Deletes progress bar", () => {
      const mockedDelete = jest.spyOn(ProgressBar.prototype, "delete");

      view.init(state);
      view.updateProgressBar(state);
      view.updateProgressBar({ ...state, progressBar: false, });

      expect(mockedDelete).toBeCalledTimes(1);

      mockedDelete.mockRestore();
    });

    test("Updates progress bar", () => {
      const mockedUpdate = jest.spyOn(ProgressBar.prototype, "update");

      view.init(state);
      view.updateProgressBar(state);

      expect(mockedUpdate).toBeCalledTimes(1);

      mockedUpdate.mockRestore();
    })
  });

  describe("Scale", () => {
    test("Deletes scale", () => {
      const mockedDelete = jest.spyOn(Scale.prototype, "delete");

      view.init(state);
      view.updateScale(state);
      view.updateScale({ ...state, scale: null, });

      expect(mockedDelete).toBeCalledTimes(1);

      mockedDelete.mockRestore();
    });

    test("Updates scale", () => {
      const mockedUpdate = jest.spyOn(Scale.prototype, "update");

      view.init(state);
      view.updateScale(state);

      expect(mockedUpdate).toBeCalledTimes(1);

      mockedUpdate.mockRestore();
    });

    test("Creates click handler", () => {
      const mockedHandler    = jest.fn(() => undefined);
      const mockedSetHandler = jest.spyOn(Scale.prototype, "setNumberClickHandler");

      view.init(state);
      view.addCreateScaleClickHandler(mockedHandler);
      view.updateScale(state);

      const handler = mockedSetHandler.mock.calls[0][0];
      handler(180);

      expect(mockedHandler).toBeCalledWith(180, "from");

      mockedSetHandler.mockRestore();
    });
  });

  describe("Slider click", () => {
    test("Enables slider click handler and adds animation", () => {
      const handler = jest.fn(() => undefined);
      view.init(state);
      view.addCreateSliderClickHandler(handler);
      view.setSliderClickHandler();

      const $html = view.getHtml();
      const $justSlider = $html.find(".just-slider__main");
  
      $justSlider.trigger("mousedown");

      expect($html.hasClass("just-slider_animated")).toBe(true);
      expect(handler).toBeCalledTimes(1);
    });

    test("Disables slider click handler and removes animation", () => {
      const handler = jest.fn(() => undefined);
      view.init(state);
      view.addCreateSliderClickHandler(handler);
      view.setSliderClickHandler();

      view.removeSliderClickHandler();

      const $html = view.getHtml();
      const $justSlider = $html.find(".just-slider__main");
  
      $justSlider.trigger("mousedown");

      expect($html.hasClass("just-slider_animated")).toBe(false);
      expect(handler).toBeCalledTimes(0);
    });

    test("Handles click in horizontal mode, HandleFrom is closer to click coordinates", () => {
      const mockedConvertPosition = jest.spyOn(Utilities, "convertViewPositionToModel");
      const handler = jest.fn(() => undefined);

      const eventMousedown = new jQuery.Event( "mousedown", {
        pageX: 280,
      });

      view.init(state);
      view.addCreateSliderClickHandler(handler);
      view.setSliderClickHandler();

      const $html = view.getHtml();
      const $justSlider = $html.find(".just-slider__main");

      const mockedOffset = jest.spyOn(jQuery.fn, "offset").mockImplementation(() => {
        return { left: 150, top: 250, };
      });

      $justSlider.width(1000);
  
      $justSlider.trigger(eventMousedown);

      expect(mockedConvertPosition).toBeCalledWith({
        position:    280,
        shift:       150,
        length:      1000,
        min:         state.min,
        max:         state.max,
        orientation: state.orientation,
        direction:   state.direction,
      });

      const convertedPosition = mockedConvertPosition.mock.results[0].value;

      expect(handler).toBeCalledWith(convertedPosition, "from");

      mockedOffset.mockRestore();
      mockedConvertPosition.mockRestore();
    });

    test("Handles click in vertical mode, HandleTo is closer to click coordinates", () => {
      const mockedConvertPosition = jest.spyOn(Utilities, "convertViewPositionToModel");
      const handler = jest.fn(() => undefined);

      const eventMousedown = new jQuery.Event( "mousedown", {
        pageY: 280,
      });

      view.init({
        ...state,
        orientation: "vertical",
        from: 0,
      });
      view.addCreateSliderClickHandler(handler);
      view.setSliderClickHandler();

      const $html = view.getHtml();
      const $justSlider = $html.find(".just-slider__main");

      const mockedOffset = jest.spyOn(jQuery.fn, "offset").mockImplementation(() => {
        return { left: 150, top: 250, };
      });

      $justSlider.height(1000);
  
      $justSlider.trigger(eventMousedown);

      expect(mockedConvertPosition).toBeCalledWith({
        position:    280,
        shift:       250,
        length:      1000,
        min:         state.min,
        max:         state.max,
        orientation: "vertical",
        direction:   state.direction,
      });

      const convertedPosition = mockedConvertPosition.mock.results[0].value;

      expect(handler).toBeCalledWith(convertedPosition, "to");

      mockedOffset.mockRestore();
      mockedConvertPosition.mockRestore();
    });
  });
});