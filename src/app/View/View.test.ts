import EventManager from '../EventManager/EventManager';
import {
  State,
} from '../types';
import {
  FORWARD,
  FROM,
  HORIZONTAL,
  TO,
  VERTICAL,
} from '../Model/constants';
import View from './View';
import Handle from './Handle/Handle';
import ProgressBar from './ProgressBar/ProgressBar';
import Scale from './Scale/Scale';
import {
  ScaleState,
} from './Scale/types';
import * as Utilities from './utilities/utilities';

describe('View', () => {
  let eventManager: EventManager;
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

  const generateView = function generateView(state: State) {
    view = new View(eventManager, state);
  };

  beforeEach(() => {
    eventManager = new EventManager();
  });

  describe('On initialization', () => {
    test('Generates html node', () => {
      generateView(state);
      const $component = view.getHtml();
      expect($component.is('.just-slider'));

      const $main = $component.find('.just-slider__main');
      expect($main.length).toBe(1);
    });
  });

  test('Sets vertical orientation', () => {
    generateView(state);
    view.setOrientation(VERTICAL);

    const $component = view.getHtml();
    expect($component.hasClass('just-slider_vertical')).toBe(true);
  });

  test('Unsets vertical orientation', () => {
    generateView(state);
    view.setOrientation(VERTICAL);
    view.setOrientation(HORIZONTAL);

    const $component = view.getHtml();
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

        view.addCreateHandleHandlers(() => undefined);
        view.updateHandle(state, TO);

        expect(mockedSetHandler).toBeCalledTimes(1);
        expect(mockedUpdate).toBeCalledTimes(1);

        mockedSetHandler.mockRestore();
        mockedUpdate.mockRestore();
      });

      test('Deletes HandleTo if range is false', () => {
        generateView(state);
        const mockedHandleDelete = jest.spyOn(view, 'deleteHandle');

        view.addCreateHandleHandlers(() => undefined);
        view.updateHandle(state, TO);
        view.updateHandle({ ...state, range: false }, TO);

        expect(mockedHandleDelete).toBeCalledTimes(1);
        expect(mockedHandleDelete).toBeCalledWith(TO);

        mockedHandleDelete.mockRestore();
      });
    });

    test('Creates handle mousemove handler', () => {
      generateView(state);
      const mockedHandler = jest.fn(() => undefined);
      const mockedSetHandler = jest.spyOn(
        Handle.prototype,
        'setHandlePointermoveHandler'
      );

      const mockedConvertPosition = jest.spyOn(
        Utilities,
        'convertViewPositionToModel'
      );

      view.addCreateHandleHandlers(mockedHandler);
      view.initComponents();

      const $component = view.getHtml();
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

      expect(mockedHandler).toBeCalledWith(convertedPosition, FROM);

      mockedOffset.mockRestore();
      mockedConvertPosition.mockRestore();
      mockedSetHandler.mockRestore();
    });

    test('Updates HandleFrom', () => {
      generateView(state);
      const mockedUpdate = jest.spyOn(Handle.prototype, 'update');

      view.addCreateHandleHandlers(() => undefined);
      view.initComponents();
      view.updateHandle(state, FROM);

      expect(mockedUpdate).toBeCalledTimes(1);
      mockedUpdate.mockRestore();
    });

    test('Deletes a handle', () => {
      generateView(state);
      const mockedHandleDelete = jest.spyOn(Handle.prototype, 'delete');

      view.addCreateHandleHandlers(() => undefined);
      view.initComponents();
      view.deleteHandle(FROM);

      expect(mockedHandleDelete).toBeCalledTimes(1);

      mockedHandleDelete.mockRestore();
    });
  });

  test('Updates tooltips', () => {
    generateView(state);
    const mockedUpdateTooltip = jest.spyOn(Handle.prototype, 'updateTooltip');

    view.addCreateHandleHandlers(() => undefined);
    view.initComponents();

    view.updateHandle(state, TO);
    view.updateTooltips(state);

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
      const mockedHandler = jest.fn(() => undefined);
      const mockedSetHandler = jest.spyOn(
        Scale.prototype,
        'setNumberClickHandler'
      );

      view.addCreateScaleClickHandler(mockedHandler);
      view.updateScale(state);

      const handler = mockedSetHandler.mock.calls[0][0];
      handler(180);

      expect(mockedHandler).toBeCalledWith(180, FROM);

      mockedSetHandler.mockRestore();
    });
  });

  describe('Slider click', () => {
    test('Enables slider click handler and adds animation', () => {
      generateView(state);
      const handler = jest.fn(() => undefined);
      view.addCreateSliderClickHandler(handler);
      view.setSliderClickHandler();

      const $component = view.getHtml();
      const $justSlider = $component.find('.just-slider__main');

      $justSlider.trigger('pointerdown');

      expect($component.hasClass('just-slider_animated')).toBe(true);
      expect(handler).toBeCalledTimes(1);
    });

    test('Disables slider click handler and removes animation', () => {
      generateView(state);
      const handler = jest.fn(() => undefined);
      view.addCreateSliderClickHandler(handler);
      view.setSliderClickHandler();

      view.removeSliderClickHandler();

      const $component = view.getHtml();
      const $justSlider = $component.find('.just-slider__main');

      $justSlider.trigger('pointerdown');

      expect($component.hasClass('just-slider_animated')).toBe(false);
      expect(handler).toBeCalledTimes(0);
    });

    test(
      'Handles click in horizontal mode, HandleFrom is closer to click pos',
      () => {
        generateView(state);
        const mockedConvertPosition = jest.spyOn(
          Utilities,
          'convertViewPositionToModel'
        );
        const handler = jest.fn(() => undefined);

        const eventPointerdown = new jQuery.Event('pointerdown', {
          pageX: 280,
        });

        view.addCreateSliderClickHandler(handler);
        view.setSliderClickHandler();

        const $component = view.getHtml();
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

        expect(handler).toBeCalledWith(convertedPosition, FROM);

        mockedOffset.mockRestore();
        mockedConvertPosition.mockRestore();
      }
    );

    test(
      'Handles click in vertical mode, HandleTo is closer to click pos',
      () => {
        const mockedConvertPosition = jest.spyOn(
          Utilities,
          'convertViewPositionToModel'
        );
        const handler = jest.fn(() => undefined);

        const eventPointerdown = new jQuery.Event('pointerdown', {
          pageY: 280,
        });

        generateView({
          ...state,
          orientation: VERTICAL,
          from: 0,
        });
        view.addCreateSliderClickHandler(handler);
        view.setSliderClickHandler();

        const $component = view.getHtml();
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

        expect(handler).toBeCalledWith(convertedPosition, TO);

        mockedOffset.mockRestore();
        mockedConvertPosition.mockRestore();
      }
    );
  });
});
