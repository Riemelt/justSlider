import EventManager from "../../EventManager/EventManager";
import {
  SLIDER_CLICK_DISABLE,
  SLIDER_CLICK_ENABLE,
} from "../../EventManager/constants";
import {
  State,
} from "../../types";
import * as Utilities from "../utilities/utilities";
import {
  HandleType,
} from "../../Model/types";
import {
  FORWARD,
  FROM,
  HORIZONTAL,
  TO,
  VERTICAL,
} from "../../Model/constants";
import Handle  from "./Handle";
import Tooltip from "./Tooltip/Tooltip";

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
    orientation: HORIZONTAL,
    direction:   FORWARD,
    range:       true,
    tooltips:    false,
    progressBar: false,
    scale:       null,
    precision:   0,
  };

  function generateHandle(type: HandleType) {
    $parent = $(`<div class="just-slider"></div>`);

    eventManager = new EventManager();

    handle = new Handle({
      eventManager,
      $parent,
      type,
      state,
    });
  }

  beforeEach(() => {
    $(document).off();
  });

  describe("Creates html node and appends to the parent", () => {
    test("Point node", () => {
      generateHandle(FROM);

      const $point = $parent.find(pointClass);
      expect($point.length).toBe(1);
    });

    test("Handle node", () => {
      generateHandle(FROM);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      expect($handle.length).toBe(1);
    });
  });
  
  test("Deletes html node from parent", () => {
    generateHandle(FROM);

    handle.delete();
    const $point = $parent.find(pointClass);

    expect($point.length).toBe(0);
  });

  test("Updates tooltip", () => {
    generateHandle(FROM);

    const mockedUpdate = jest.spyOn(Tooltip.prototype, "update");

    handle.update({ ...state, tooltips: true });
    expect(mockedUpdate).toBeCalled();

    mockedUpdate.mockRestore();
  });

  test("Deletes tooltip", () => {
    generateHandle(FROM);

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
      generateHandle(TO);

      handle.update({ ...state, from: -80, to: -50, });
      const $point = $parent.find(pointClass);

      expect($point.hasClass(focusedClass)).toBe(true);
      expect($point.hasClass(unfocusedClass)).toBe(false);
    });

    test("Unsets focus", () => {
      generateHandle(TO);

      handle.update(state);
      const $point = $parent.find(pointClass);

      expect($point.hasClass(focusedClass)).toBe(false);
      expect($point.hasClass(unfocusedClass)).toBe(true);
    });
  });

  test("Updates transform styles", () => {
    const mockedTransform = jest.spyOn(Utilities, "getTransformStyles");

    generateHandle(FROM);
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
    generateHandle(FROM);
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

      generateHandle(FROM);
      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.getHandleHTML();
      $handle.trigger(eventKeydown);

      expect(handler).toBeCalledWith(210, FROM, true);
    });

    test("Moves backward by step when left arrow is pressed", () => {
      const handler = jest.fn(() => undefined);
      const eventKeydown = new jQuery.Event("keydown", {
        key: "ArrowLeft",
      });

      generateHandle(FROM);
      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.getHandleHTML();
      $handle.trigger(eventKeydown);

      expect(handler).toBeCalledWith(190, FROM, true);
    });
  });

  describe("Drag'n'drop", () => {
    test("Disables slider click on pointerdown", () => {
      const mockedDispatchEvent = jest.spyOn(EventManager.prototype, "dispatchEvent");
      generateHandle(FROM);
      handle.update(state);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      $handle.trigger("pointerdown");
      $(document).trigger("pointerup");

      expect(mockedDispatchEvent).toBeCalledWith(SLIDER_CLICK_DISABLE);

      mockedDispatchEvent.mockRestore();
    });

    test("Enables slider click on pointerup", () => {
      const mockedDispatchEvent = jest.spyOn(EventManager.prototype, "dispatchEvent");
      generateHandle(FROM);
      handle.update(state);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      $handle.trigger("pointerdown");
      $(document).trigger("pointerup");

      expect(mockedDispatchEvent).toBeCalledWith(SLIDER_CLICK_ENABLE);

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

      generateHandle(FROM);

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

      expect(handler).toBeCalledWith(270, FROM);

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

      generateHandle(FROM);

      handle.setHandlePointermoveHandler(handler);
      handle.update({ ...state, orientation: VERTICAL, });

      const $handle = handle.getHandleHTML();

      $handle.outerWidth(100);
      
      const mockedHandleOffset = jest.spyOn($handle, "offset").mockImplementation(() => {
        return { left: 200, top: 400, };
      });

      $handle.trigger(eventPointerdown);
      $(document).trigger(eventPointermove);
      $(document).trigger("pointerup");

      expect(handler).toBeCalledWith(480, FROM);

      mockedHandleOffset.mockRestore();
    });
  });
});