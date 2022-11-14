import EventManager from "../EventManager/EventManager";
import { Options } from "../types";
import View from "./View";
import Handle from "./Handle/Handle";
import ProgressBar from "./ProgressBar/ProgressBar";
import * as Utilities from "./utilities";

describe("View", () => {
  let eventManager: EventManager;
  let view:         View;
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

  beforeEach(() => {
    eventManager = new EventManager();
    view =         new View(eventManager);
  });

  describe("On initialization", () => {
    test("Generates html node", () => {
      view.init(options);
  
      const $html = view.getHtml();
      expect($html.is(".just-slider"));
  
      const $main = $html.find(".just-slider__main");
      expect($main.length).toBe(1);
    });
  });

  test("Sets vertical orientation", () => {
    view.init(options);
    view.setOrientation("vertical");

    const $html = view.getHtml();
    expect($html.hasClass("just-slider_vertical")).toBe(true);
  });

  test("Unsets vertical orientation", () => {
    view.init(options);
    view.setOrientation("vertical");
    view.setOrientation("horizontal");

    const $html = view.getHtml();
    expect($html.hasClass("just-slider_vertical")).toBe(false);
  });

  describe("Handles", () => {
    describe("Updates HandleTo", () => {
      test("Creates and updates HandleTo if range is true", () => {
        const mockedUpdate = jest.spyOn(Handle.prototype, "update");
        const mockedSetHandler = jest.spyOn(Handle.prototype, "setHandleMousemoveHandler");
  
        view.init(options);
        view.addCreateHandleHandlers(() => undefined);
        view.updateHandleTo(options);
  
        expect(mockedSetHandler).toBeCalledTimes(1);
        expect(mockedUpdate).toBeCalledTimes(1);
  
        mockedSetHandler.mockRestore();
        mockedUpdate.mockRestore();
      });
  
      test("Deletes HandleTo if range is false", () => {
        const mockedHandleDelete = jest.spyOn(view, "deleteHandle");
  
        view.init(options);
        view.addCreateHandleHandlers(() => undefined);
        view.updateHandleTo(options);
        view.updateHandleTo({ ...options, range: false});
  
        expect(mockedHandleDelete).toBeCalledTimes(1);
        expect(mockedHandleDelete).toBeCalledWith("to");
  
        mockedHandleDelete.mockRestore();
      });
    });

    test("Creates handle mousemove handler", () => {
      const mockedHandler = jest.fn(() => undefined);
      const mockedSetHandler = jest.spyOn(Handle.prototype, "setHandleMousemoveHandler");
  
      view.init(options);
      view.addCreateHandleHandlers(mockedHandler);
      view.initComponents();
  
      const handler = mockedSetHandler.mock.calls[0][0];
      handler(0, "from");
  
      expect(mockedHandler).toBeCalledTimes(1);
  
      mockedSetHandler.mockRestore();
    });
  
    test("Updates HandleFrom", () => {
      const mockedUpdate = jest.spyOn(Handle.prototype, "update");
  
      view.init(options);
      view.addCreateHandleHandlers(() => undefined);
      view.initComponents();
      view.updateHandleFrom(options);
  
      expect(mockedUpdate).toBeCalledTimes(1);
      mockedUpdate.mockRestore();
    });

    test("Deletes a handle", () => { 
      const mockedHandleDelete = jest.spyOn(Handle.prototype, "delete");
  
      view.init(options);
      view.addCreateHandleHandlers(() => undefined);
      view.initComponents();
      view.deleteHandle("from");
  
      expect(mockedHandleDelete).toBeCalledTimes(1);
  
      mockedHandleDelete.mockRestore();
    });
  });

  test("Updates tooltips", () => {
    const mockedUpdateTooltip = jest.spyOn(Handle.prototype, "updateTooltip");

    view.init(options);
    view.addCreateHandleHandlers(() => undefined);
    view.initComponents();

    view.updateHandleTo(options);
    view.updateTooltips(options);

    expect(mockedUpdateTooltip).toBeCalledTimes(3);

    mockedUpdateTooltip.mockRestore();
  });

  describe("Progress bar", () => {
    test("Deletes progress bar", () => {
      const mockedDelete = jest.spyOn(ProgressBar.prototype, "delete");

      view.init(options);
      view.updateProgressBar(options);
      view.updateProgressBar({ ...options, progressBar: false, });

      expect(mockedDelete).toBeCalledTimes(1);

      mockedDelete.mockRestore();
    });

    test("Updates progress bar", () => {
      const mockedUpdate = jest.spyOn(ProgressBar.prototype, "update");

      view.init(options);
      view.updateProgressBar(options);

      expect(mockedUpdate).toBeCalledTimes(1);

      mockedUpdate.mockRestore();
    })
  });

  describe("Slider click", () => {
    test("Enables slider click handler and adds animation", () => {
      const handler = jest.fn(() => undefined);
      view.init(options);
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
      view.init(options);
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

      view.init(options);
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
        min:         options.min,
        max:         options.max,
        orientation: options.orientation,
        direction:   options.direction,
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
        ...options,
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
        min:         options.min,
        max:         options.max,
        orientation: "vertical",
        direction:   options.direction,
      });

      const convertedPosition = mockedConvertPosition.mock.results[0].value;

      expect(handler).toBeCalledWith(convertedPosition, "to");

      mockedOffset.mockRestore();
      mockedConvertPosition.mockRestore();
    });
  });
});