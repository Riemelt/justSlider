import { State } from '../../types';
import * as Utilities from '../../utilities/utilities';
import { HandleType } from '../../Model/types';
import { FORWARD, FROM, HORIZONTAL, TO, VERTICAL } from '../../Model/constants';
import Handle from './Handle';

describe('Handle', () => {
  let handle: Handle;
  let $parent: JQuery<HTMLElement>;

  const handleClass = '.just-slider__handle';
  const pointClass = '.just-slider__point';
  const state: State = {
    from: 200,
    to: 250,
    step: 10,
    min: -100,
    max: 300,
    orientation: HORIZONTAL,
    direction: FORWARD,
    range: true,
    tooltips: false,
    progressBar: false,
    scale: null,
    precision: 0,
  };

  const domRect = {
    width: 100,
    height: 100,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => undefined,
  };

  const generateHandle = function generateHandle(
    type: HandleType,
    state: State,
  ) {
    $parent = $('<div class="just-slider"></div>');

    handle = new Handle({
      $parent,
      type,
      state,
    });
  };

  beforeEach(() => {
    $(document).off();
  });

  describe('Creates html node and appends to the parent', () => {
    test('Point node', () => {
      generateHandle(FROM, state);

      const $point = $parent.find(pointClass);
      expect($point.length).toBe(1);
    });

    test('Handle node', () => {
      generateHandle(FROM, state);

      const $handle = $parent.find(`${pointClass} ${handleClass}`);
      expect($handle.length).toBe(1);
    });
  });

  test('Deletes html node from parent', () => {
    generateHandle(FROM, state);

    handle.delete();
    const $point = $parent.find(pointClass);

    expect($point.length).toBe(0);
  });

  test('Updates transform styles', () => {
    const mockedTransform = jest.spyOn(Utilities, 'getTransformStyles');

    generateHandle(FROM, state);
    handle.update(state);

    expect(mockedTransform).toBeCalledWith({
      min: state.min,
      max: state.max,
      orientation: state.orientation,
      direction: state.direction,
      shift: state.from,
    });

    const { property, style } = mockedTransform.mock.results[0].value;
    const $point = $parent.find(pointClass);

    expect($point.css(property)).toBe(style);

    mockedTransform.mockRestore();
  });

  test('Sets PointerMove handler', () => {
    generateHandle(FROM, state);
    const handler = jest.fn(() => undefined);
    handle.setHandlePointermoveHandler(handler);
    handle.update(state);

    const $handle = $parent.find(`${pointClass} ${handleClass}`);
    $handle.trigger('pointerdown');
    $(document).trigger('pointermove');
    $(document).trigger('pointerup');
    expect(handler).toBeCalledTimes(1);
  });

  describe('Keyboard control', () => {
    test('Moves forward by step when right arrow is pressed', () => {
      const handler = jest.fn(() => undefined);
      const eventKeydown = new jQuery.Event('keydown', {
        key: 'ArrowRight',
      });

      generateHandle(FROM, state);
      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.$getHtml();
      $handle.trigger(eventKeydown);

      expect(handler).toBeCalledWith(210, FROM, true);
    });

    test('Moves backward by step when left arrow is pressed', () => {
      const handler = jest.fn(() => undefined);
      const eventKeydown = new jQuery.Event('keydown', {
        key: 'ArrowLeft',
      });

      generateHandle(FROM, state);
      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.$getHtml();
      $handle.trigger(eventKeydown);

      expect(handler).toBeCalledWith(190, FROM, true);
    });
  });

  describe('Drag\'n\'drop', () => {
    test('Drag\'n\'drop in horizontal mode', () => {
      const handler = jest.fn(() => undefined);

      const eventPointerdown = new jQuery.Event('pointerdown', {
        pageX: 280,
      });
      const eventPointermove = new jQuery.Event('pointermove', {
        pageX: 300,
      });

      generateHandle(FROM, state);

      handle.setHandlePointermoveHandler(handler);
      handle.update(state);

      const $handle = handle.$getHtml();

      const handleElement = $handle.get(0);

      if (handleElement === undefined) {
        expect(handleElement).toBeDefined();
        return;
      }

      const mockedBoundingRect = jest
        .spyOn(handleElement, 'getBoundingClientRect')
        .mockImplementation(() => (domRect));

      const mockedHandleOffset = jest
        .spyOn($handle, 'offset')
        .mockImplementation(() => ({ left: 200, top: 200 }));

      $handle.trigger(eventPointerdown);
      $(document).trigger(eventPointermove);
      $(document).trigger('pointerup');

      expect(handler).toBeCalledWith(270, FROM);

      mockedBoundingRect.mockRestore();
      mockedHandleOffset.mockRestore();
    });

    test('Drag\'n\'drop in vertical mode', () => {
      const handler = jest.fn(() => undefined);
      const eventPointerdown = new jQuery.Event('pointerdown', {
        pageY: 470,
      });
      const eventPointermove = new jQuery.Event('pointermove', {
        pageY: 500,
      });

      generateHandle(FROM, { ...state, orientation: VERTICAL });

      handle.setHandlePointermoveHandler(handler);
      handle.update({ ...state, orientation: VERTICAL });

      const $handle = handle.$getHtml();

      const handleElement = $handle.get(0);

      if (handleElement === undefined) {
        expect(handleElement).toBeDefined();
        return;
      }

      const mockedBoundingRect = jest
        .spyOn(handleElement, 'getBoundingClientRect')
        .mockImplementation(() => (domRect));

      const mockedHandleOffset = jest
        .spyOn($handle, 'offset')
        .mockImplementation(() => ({ left: 200, top: 400 }));

      $handle.trigger(eventPointerdown);
      $(document).trigger(eventPointermove);
      $(document).trigger('pointerup');

      expect(handler).toBeCalledWith(480, FROM);

      mockedBoundingRect.mockRestore();
      mockedHandleOffset.mockRestore();
    });
  });

  test('Sets type', () => {
    const handler = jest.fn(() => undefined);
    generateHandle(FROM, state);
    handle.setHandlePointermoveHandler(handler);
    handle.setType(TO);
    handle.update(state);

    const $handle = handle.$getHtml();
    $handle.trigger('pointerdown');
    $(document).trigger('pointermove');

    expect(handler).toBeCalledWith(0, TO);
  });
});
