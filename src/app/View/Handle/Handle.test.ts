import EventManager from "../../EventManager/EventManager";
import { State } from "../../types";
import Handle from "./Handle";
import Tooltip from "./Tooltip/Tooltip";

import * as Utilities from "../utilities/utilities";

describe("Handle", () => {
  let handle: Handle;
  let $parent: JQuery<HTMLElement>;
  let eventManager: EventManager;

  const handleClass = ".just-slider__handle";
  const pointClass  = ".just-slider__point";
  const state: State = {
    from:        200,
    to:          250,
    step:        10,
    min:         -100,
    max:         300,
    orientation: "horizontal",
    direction:   "forward",
    range:       true,
    tooltips:    false,
  };

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

    handle.update({ ...state, tooltips: true });
    expect(mockedUpdate).toBeCalled();

    mockedUpdate.mockRestore();
  });

  test("Deletes tooltip", () => {
    generateHandle("from");

    const mockedDelete = jest.spyOn(Tooltip.prototype, "delete");

    handle.update({ ...state, tooltips: true });
    handle.update({ ...state, tooltips: false });
    expect(mockedDelete).toBeCalled();

    mockedDelete.mockRestore();
  });

  describe("Updates focus", () => {
    const unfocusedClass = "just-slider__point_unfocused";
    const focusedClass = "just-slider__point_focused";

    test("Sets focus", () => {
      generateHandle("to");

      handle.update({ ...state, from: -80, to: -50, });
      const $point = $parent.find(pointClass);

      expect($point.hasClass(focusedClass)).toBe(true);
      expect($point.hasClass(unfocusedClass)).toBe(false);
    });

    test("Unsets focus", () => {
      generateHandle("to");

      handle.update(state);
      const $point = $parent.find(pointClass);

      expect($point.hasClass(focusedClass)).toBe(false);
      expect($point.hasClass(unfocusedClass)).toBe(true);
    });
  });

  test("Updates transform styles", () => {
    const mockedTransform = jest.spyOn(Utilities, "getTransformStyles");

    generateHandle("from");
    handle.update(state);

    expect(mockedTransform).toBeCalledWith({
      min:         state.min,
      max:         state.max,
      orientation: state.orientation,
      direction:   state.direction,
      shift:       state.from,
    });

    const { property, style } = mockedTransform.mock.results[0].value;
    const $point = $parent.find(pointClass);

    expect($point.css(property)).toBe(style);

    mockedTransform.mockRestore();
  });

  test("Sets PointerMove handler", () => {
    generateHandle("from");
    const handler = jest.fn(() => undefined);
    handle.setHandlePointermoveHandler(handler);
    handle.update(state);

    const $handle = $parent.find(`${pointClass} ${handleClass}`);
    $handle.trigger("pointerdown");
    $(document).trigger("pointermove");
    $(document).trigger("pointerup");
    expect(handler).toBeCalledTimes(1);
  });

  describe("Keyboard control", () => {
    test("Moves forward by step when right arrow is pressed", () => {
      const handler = jest.fn(() => undefined);
      const eventKeydown = new jQuery.Event("keydown", {
        key: "ArrowRight",
      });

      generateHandle("from");
      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.getHandleHTML();
      $handle.trigger(eventKeydown);

      expect(handler).toBeCalledWith(210, "from", true);
    });

    test("Moves backward by step when left arrow is pressed", () => {
      const handler = jest.fn(() => undefined);
      const eventKeydown = new jQuery.Event("keydown", {
        key: "ArrowLeft",
      });

      generateHandle("from");
      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.getHandleHTML();
      $handle.trigger(eventKeydown);

      expect(handler).toBeCalledWith(190, "from", true);
    });
  });

  describe("Drag'n'drop", () => {
    test("Disables slider click on pointerdown", () => {
      const mockedDispatchEvent = jest.spyOn(EventManager.prototype, "dispatchEvent");
      generateHandle("from");
      handle.update(state);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      $handle.trigger("pointerdown");
      $(document).trigger("pointerup");

      expect(mockedDispatchEvent).toBeCalledWith("SliderClickDisable");

      mockedDispatchEvent.mockRestore();
    });

    test("Enables slider click on pointerup", () => {
      const mockedDispatchEvent = jest.spyOn(EventManager.prototype, "dispatchEvent");
      generateHandle("from");
      handle.update(state);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      $handle.trigger("pointerdown");
      $(document).trigger("pointerup");

      expect(mockedDispatchEvent).toBeCalledWith("SliderClickEnable");

      mockedDispatchEvent.mockRestore();
    });

    test("Drag'n'drop in horizontal mode", () => {
      const handler = jest.fn(() => undefined);

      const eventPointerdown = new jQuery.Event("pointerdown", {
        pageX: 280,
      });
      const eventPointermove = new jQuery.Event("pointermove", {
        pageX: 300,
      });

      generateHandle("from");

      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.getHandleHTML();

      $handle.outerWidth(100);
      
      const mockedHandleOffset = jest.spyOn($handle, "offset").mockImplementation(() => {
        return { left: 200, top: 200, };
      });

      $handle.trigger(eventPointerdown);
      $(document).trigger(eventPointermove);
      $(document).trigger("pointerup");

      expect(handler).toBeCalledWith(270, "from");

      mockedHandleOffset.mockRestore();
    });

    test("Drag'n'drop in vertical mode", () => {
      const handler = jest.fn(() => undefined);
      const eventPointerdown = new jQuery.Event("pointerdown", {
        pageY: 470,
      });
      const eventPointermove = new jQuery.Event("pointermove", {
        pageY: 500,
      });

      generateHandle("from");

      handle.setHandlePointermoveHandler(handler);
      handle.update({ ...state, orientation: "vertical", });

      const $handle = handle.getHandleHTML();

      $handle.outerHeight(100);
      
      const mockedHandleOffset = jest.spyOn($handle, "offset").mockImplementation(() => {
        return { left: 200, top: 400, };
      });

      $handle.trigger(eventPointerdown);
      $(document).trigger(eventPointermove);
      $(document).trigger("pointerup");

      expect(handler).toBeCalledWith(480, "from");

      mockedHandleOffset.mockRestore();
    });
  });
});