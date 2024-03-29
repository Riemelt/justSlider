import { State } from '../types';
import { FORWARD, FROM, HORIZONTAL, TO, VERTICAL } from '../Model/constants';
import * as Utilities from '../utilities/utilities';
import View from './View';
import Handle from './Handle/Handle';
import ProgressBar from './ProgressBar/ProgressBar';
import Scale from './Scale/Scale';
import { ScaleState } from './Scale/types';
import Tooltip from './Tooltip/Tooltip';
import { HANDLE_MOVE, SCALE_CLICK, SLIDER_CLICK } from './constants';

describe('View', () => {
  let view: View;

  const scale: ScaleState = {
    segments: [],
    lines: true,
    numbers: true,
    density: 1,
  };

  const state: State = {
    scale,
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
    precision: 0,
  };

  const $container: JQuery<HTMLElement> = $(`
    <div class="just-slider">
    </div>
  `);

  const generateView = function generateView(state: State) {
    view = new View(state, $container);
  };

  describe('On initialization', () => {
    test('Generates html node', () => {
      generateView(state);
      const $component = view.$getHtml();
      expect($component.is('.just-slider'));

      const $main = $component.find('.just-slider__main');
      expect($main.length).toBe(1);
    });
  });

  test('Sets vertical orientation', () => {
    generateView(state);
    view.setOrientation({
      ...state,
      orientation: VERTICAL,
    });

    const $component = view.$getHtml();
    expect($component.hasClass('just-slider_vertical')).toBe(true);
  });

  test('Unsets vertical orientation', () => {
    generateView(state);
    view.setOrientation({
      ...state,
      orientation: VERTICAL,
    });
    view.setOrientation(state);

    const $component = view.$getHtml();
    expect($component.hasClass('just-slider_vertical')).toBe(false);
  });

  describe('Handles', () => {
    describe('Updates HandleTo', () => {
      test('Creates and updates HandleTo if range is true', () => {
        generateView(state);
        const mockedUpdate = jest.spyOn(Handle.prototype, 'update');
        const mockedSetHandler = jest.spyOn(
          Handle.prototype,
          'setHandlePointermoveHandler',
        );

        view.updateHandle(state, TO);

        expect(mockedSetHandler).toBeCalledTimes(1);
        expect(mockedUpdate).toBeCalledTimes(1);

        mockedSetHandler.mockRestore();
        mockedUpdate.mockRestore();
      });

      test('Deletes HandleTo if range is false', () => {
        generateView(state);
        const mockedHandleDelete = jest.spyOn(view, 'deleteHandle');

        view.updateHandle(state, TO);
        view.updateHandle({ ...state, range: false }, TO);

        expect(mockedHandleDelete).toBeCalledTimes(1);
        expect(mockedHandleDelete).toBeCalledWith(TO);

        mockedHandleDelete.mockRestore();
      });
    });

    test('Creates handle mousemove handler', () => {
      generateView(state);
      const mockedDispatcher = jest.spyOn(view, 'dispatchEvent');
      const mockedSetHandler = jest.spyOn(
        Handle.prototype,
        'setHandlePointermoveHandler'
      );

      const mockedConvertPosition = jest.spyOn(
        Utilities,
        'getConvertedViewPositionToModel'
      );

      view.initComponents();

      const $component = view.$getHtml();
      const $justSlider = $component.find('.just-slider__main');

      const mockedOffset = jest
        .spyOn(jQuery.fn, 'offset')
        .mockImplementation(() => ({ left: 150, top: 250 }));

      $justSlider.width(1000);

      const handler = mockedSetHandler.mock.calls[0][0];
      handler(250, FROM);

      expect(mockedConvertPosition).toBeCalledWith({
        position: 250,
        shift: 150,
        length: 1000,
        min: state.min,
        max: state.max,
        orientation: state.orientation,
        direction: state.direction,
      });

      const convertedPosition = mockedConvertPosition.mock.results[0].value;

      const dispatchedEvent = mockedDispatcher.mock.calls[0][0];
      const dispatchedData = mockedDispatcher.mock.calls[0][1];

      expect(dispatchedEvent).toBe(HANDLE_MOVE);
      expect(dispatchedData).toEqual({
        value: convertedPosition,
        handle: FROM,
      });

      mockedOffset.mockRestore();
      mockedConvertPosition.mockRestore();
      mockedSetHandler.mockRestore();
    });

    test('Updates HandleFrom', () => {
      generateView(state);
      const mockedUpdate = jest.spyOn(Handle.prototype, 'update');

      view.initComponents();
      view.updateHandle(state, FROM);

      expect(mockedUpdate).toBeCalledTimes(1);
      mockedUpdate.mockRestore();
    });

    test('Deletes a handle', () => {
      generateView(state);
      const mockedHandleDelete = jest.spyOn(Handle.prototype, 'delete');

      view.initComponents();
      view.deleteHandle(FROM);

      expect(mockedHandleDelete).toBeCalledTimes(1);

      mockedHandleDelete.mockRestore();
    });
  });

  test('Updates tooltips', () => {
    generateView(state);
    const mockedUpdateTooltip = jest.spyOn(Tooltip.prototype, 'update');

    view.initComponents();

    view.updateTooltips({
      ...state,
      tooltips: true,
    });

    expect(mockedUpdateTooltip).toBeCalledTimes(3);

    mockedUpdateTooltip.mockRestore();
  });

  describe('Progress bar', () => {
    test('Deletes progress bar', () => {
      generateView(state);
      const mockedDelete = jest.spyOn(ProgressBar.prototype, 'delete');

      view.updateProgressBar(state);
      view.updateProgressBar({ ...state, progressBar: false });

      expect(mockedDelete).toBeCalledTimes(1);

      mockedDelete.mockRestore();
    });

    test('Updates progress bar', () => {
      generateView(state);
      const mockedUpdate = jest.spyOn(ProgressBar.prototype, 'update');

      view.updateProgressBar(state);

      expect(mockedUpdate).toBeCalledTimes(1);

      mockedUpdate.mockRestore();
    });
  });

  describe('Scale', () => {
    test('Deletes scale', () => {
      generateView(state);
      const mockedDelete = jest.spyOn(Scale.prototype, 'delete');

      view.updateScale(state);
      view.updateScale({ ...state, scale: null });

      expect(mockedDelete).toBeCalledTimes(1);

      mockedDelete.mockRestore();
    });

    test('Updates scale', () => {
      generateView(state);
      const mockedUpdate = jest.spyOn(Scale.prototype, 'update');

      view.updateScale(state);

      expect(mockedUpdate).toBeCalledTimes(1);

      mockedUpdate.mockRestore();
    });

    test('Creates click handler', () => {
      generateView(state);

      const mockedDispatcher = jest.spyOn(view, 'dispatchEvent');
      const mockedSetHandler = jest.spyOn(
        Scale.prototype,
        'setNumberClickHandler'
      );

      view.updateScale(state);

      const handler = mockedSetHandler.mock.calls[0][0];
      handler(180);

      const dispatchedEvent = mockedDispatcher.mock.calls[0][0];
      const dispatchedData = mockedDispatcher.mock.calls[0][1];

      expect(dispatchedEvent).toBe(SCALE_CLICK);
      expect(dispatchedData).toEqual({
        value: 180,
        handle: FROM,
        shouldAdjust: false,
      });

      mockedSetHandler.mockRestore();
    });
  });

  describe('Slider click', () => {
    test(
      'Handles click in horizontal mode, HandleFrom is closer to click pos',
      () => {
        generateView(state);
        const mockedDispatcher = jest.spyOn(view, 'dispatchEvent');
        const mockedConvertPosition = jest.spyOn(
          Utilities,
          'getConvertedViewPositionToModel'
        );

        const eventPointerdown = new jQuery.Event('pointerdown', {
          pageX: 280,
        });

        const $component = view.$getHtml();
        const $justSlider = $component.find('.just-slider__main');

        const mockedOffset = jest
          .spyOn(jQuery.fn, 'offset')
          .mockImplementation(() => ({ left: 150, top: 250 }));

        $justSlider.width(1000);

        $justSlider.trigger(eventPointerdown);

        expect(mockedConvertPosition).toBeCalledWith({
          position: 280,
          shift: 150,
          length: 1000,
          min: state.min,
          max: state.max,
          orientation: state.orientation,
          direction: state.direction,
        });

        const convertedPosition = mockedConvertPosition.mock.results[0].value;

        const dispatchedEvent = mockedDispatcher.mock.calls[0][0];
        const dispatchedData = mockedDispatcher.mock.calls[0][1];

        expect(dispatchedEvent).toBe(SLIDER_CLICK);
        expect(dispatchedData).toEqual({
          value: convertedPosition,
          handle: FROM,
        });

        mockedOffset.mockRestore();
        mockedConvertPosition.mockRestore();
      }
    );

    test(
      'Handles click in vertical mode, HandleTo is closer to click pos',
      () => {
        generateView({
          ...state,
          orientation: VERTICAL,
          from: 0,
        });

        const mockedDispatcher = jest.spyOn(view, 'dispatchEvent');
        const mockedConvertPosition = jest.spyOn(
          Utilities,
          'getConvertedViewPositionToModel'
        );

        const eventPointerdown = new jQuery.Event('pointerdown', {
          pageY: 280,
        });

        const $component = view.$getHtml();
        const $justSlider = $component.find('.just-slider__main');

        const mockedOffset = jest
          .spyOn(jQuery.fn, 'offset')
          .mockImplementation(() => ({ left: 150, top: 250 }));

        $justSlider.height(1000);

        $justSlider.trigger(eventPointerdown);

        expect(mockedConvertPosition).toBeCalledWith({
          position: 280,
          shift: 250,
          length: 1000,
          min: state.min,
          max: state.max,
          orientation: VERTICAL,
          direction: state.direction,
        });

        const convertedPosition = mockedConvertPosition.mock.results[0].value;

        const dispatchedEvent = mockedDispatcher.mock.calls[0][0];
        const dispatchedData = mockedDispatcher.mock.calls[0][1];

        expect(dispatchedEvent).toBe(SLIDER_CLICK);
        expect(dispatchedData).toEqual({
          value: convertedPosition,
          handle: TO,
        });

        mockedOffset.mockRestore();
        mockedConvertPosition.mockRestore();
      }
    );
  });
});
