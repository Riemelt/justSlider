import EventManager from "../../EventManager/EventManager";
import { Options } from "../../types";
import Handle from "./Handle";
import Tooltip from "./Tooltip/Tooltip";

import * as Utilities from "../utilities";

describe("Handle", () => {
  let handle: Handle;
  let $parent: JQuery<HTMLElement>;
  let eventManager: EventManager;

  const handleClass = ".just-slider__handle";
  const pointClass  = ".just-slider__point";
  const options: Options = { from: 200, to: 250, step: 10, min: -100, max: 300, orientation: "horizontal", direction: "forward", range: true, tooltips: false };

  function generateHandle(type: HandleType) {
    $parent = $(`<div class="just-slider"></div>`);

    eventManager = new EventManager();

    handle = new Handle({
      eventManager,
      $parent,
      type,
    });
  }

  beforeEach(() => {
    $(document).off();
  });

  describe("Creates html node and appends to the parent", () => {
    test("Point node", () => {
      generateHandle("from");

      const $point = $parent.find(pointClass);
      expect($point.length).toBe(1);
    });

    test("Handle node", () => {
      generateHandle("from");

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      expect($handle.length).toBe(1);
    });
  });
  
  test("Deletes html node from parent", () => {
    generateHandle("from");

    handle.delete();
    const $point = $parent.find(pointClass);

    expect($point.length).toBe(0);
  });

  test("Updates tooltip", () => {
    generateHandle("from");

    const mockedUpdate = jest.spyOn(Tooltip.prototype, "update");

    handle.update({ ...options, tooltips: true });
    expect(mockedUpdate).toBeCalled();

    mockedUpdate.mockRestore();
  });

  test("Deletes tooltip", () => {
    generateHandle("from");

    const mockedDelete = jest.spyOn(Tooltip.prototype, "delete");

    handle.update({ ...options, tooltips: true });
    handle.update({ ...options, tooltips: false });
    expect(mockedDelete).toBeCalled();

    mockedDelete.mockRestore();
  });

  describe("Updates focus", () => {
    const unfocusedClass = "just-slider__point_unfocused";
    const focusedClass = "just-slider__point_focused";

    test("Sets focus", () => {
      generateHandle("to");

      handle.update({ ...options, from: -80, to: -50, });
      const $point = $parent.find(pointClass);

      expect($point.hasClass(focusedClass)).toBe(true);
      expect($point.hasClass(unfocusedClass)).toBe(false);
    });

    test("Unsets focus", () => {
      generateHandle("to");

      handle.update(options);
      const $point = $parent.find(pointClass);

      expect($point.hasClass(focusedClass)).toBe(false);
      expect($point.hasClass(unfocusedClass)).toBe(true);
    });
  });

  test("Updates transform styles", () => {
    const mockedTransform = jest.spyOn(Utilities, "transform");

    generateHandle("from");
    handle.update(options);

    expect(mockedTransform).toBeCalledWith({
      min:         options.min,
      max:         options.max,
      orientation: options.orientation,
      direction:   options.direction,
      shift:       options.from,
    });

    const transformValue = mockedTransform.mock.results[0].value;
    const $point = $parent.find(pointClass);

    expect($point.css("transform")).toBe(transformValue);

    mockedTransform.mockRestore();
  });

  test("Sets MouseMove handler", () => {
    generateHandle("from");
    const handler = jest.fn(() => undefined);
    handle.setHandleMousemoveHandler(handler);
    handle.update(options);

    const $handle = $parent.find(`${pointClass} ${handleClass}`);
    $handle.trigger("mousedown");
    $(document).trigger("mousemove");
    $(document).trigger("mouseup");
    expect(handler).toBeCalledTimes(1);
  });

  describe("Drag'n'drop", () => {
    test("Disables slider click on mousedown", () => {
      const mockedDispatchEvent = jest.spyOn(EventManager.prototype, "dispatchEvent");
      generateHandle("from");
      handle.update(options);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      $handle.trigger("mousedown");
      $(document).trigger("mouseup");

      expect(mockedDispatchEvent).toBeCalledWith("SliderClickDisable");

      mockedDispatchEvent.mockRestore();
    });

    test("Enables slider click on mouseup", () => {
      const mockedDispatchEvent = jest.spyOn(EventManager.prototype, "dispatchEvent");
      generateHandle("from");
      handle.update(options);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      $handle.trigger("mousedown");
      $(document).trigger("mouseup");

      expect(mockedDispatchEvent).toBeCalledWith("SliderClickEnable");

      mockedDispatchEvent.mockRestore();
    });

    test("Drag'n'drop in horizontal mode", () => {
      const mockedConvertPosition = jest.spyOn(Utilities, "convertViewPositionToModel");
      const handler = jest.fn(() => undefined);
      const eventMousedown = new jQuery.Event( "mousedown", {
        pageX: 280,
      });
      const eventMousemove = new jQuery.Event( "mousemove", {
        pageX: 300,
      });

      generateHandle("from");

      const mockedParentOffset = jest.spyOn($parent, "offset").mockImplementation(() => {
        return { left: 150, top: 250, };
      });

      $parent.width(1000);

      handle.setHandleMousemoveHandler(handler);
      handle.update(options);

      const $handle = handle.getHandleHTML();

      $handle.outerWidth(100);
      
      const mockedHandleOffset = jest.spyOn($handle, "offset").mockImplementation(() => {
        return { left: 200, top: 200, };
      });

      $handle.trigger(eventMousedown);
      $(document).trigger(eventMousemove);
      $(document).trigger("mouseup");

      expect(mockedConvertPosition).toBeCalledWith({
        position:    270,
        shift:       150,
        length:      1000,
        min:         options.min,
        max:         options.max,
        orientation: options.orientation,
        direction:   options.direction,
      });

      const convertedPosition = mockedConvertPosition.mock.results[0].value;

      expect(handler).toBeCalledWith(convertedPosition, "from");

      mockedConvertPosition.mockRestore();
      mockedParentOffset.mockRestore();
      mockedHandleOffset.mockRestore();
    });

    test("Drag'n'drop in vertical mode", () => {
      const mockedConvertPosition = jest.spyOn(Utilities, "convertViewPositionToModel");
      const handler = jest.fn(() => undefined);
      const eventMousedown = new jQuery.Event( "mousedown", {
        pageY: 470,
      });
      const eventMousemove = new jQuery.Event( "mousemove", {
        pageY: 500,
      });

      generateHandle("from");

      const mockedParentOffset = jest.spyOn($parent, "offset").mockImplementation(() => {
        return { left: 150, top: 250, };
      });

      $parent.height(1000);

      handle.setHandleMousemoveHandler(handler);
      handle.update({ ...options, orientation: "vertical", });

      const $handle = handle.getHandleHTML();

      $handle.outerHeight(100);
      
      const mockedHandleOffset = jest.spyOn($handle, "offset").mockImplementation(() => {
        return { left: 200, top: 200, };
      });

      $handle.trigger(eventMousedown);
      $(document).trigger(eventMousemove);
      $(document).trigger("mouseup");

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

      expect(handler).toBeCalledWith(convertedPosition, "from");

      mockedConvertPosition.mockRestore();
      mockedParentOffset.mockRestore();
      mockedHandleOffset.mockRestore();
    });
  });
});