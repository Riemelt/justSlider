import {
  HANDLES_SWAP,
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  ORIENTATION_UPDATE,
  PROGRESS_BAR_UPDATE,
  SCALE_UPDATE,
  SLIDER_CLICK_DISABLE,
  SLIDER_CLICK_ENABLE,
  SLIDER_UPDATE,
  TOOLTIPS_UPDATE,
} from '../EventManager/constants';
import EventManager from '../EventManager/EventManager';
import { SliderEvent } from '../EventManager/types';
import { FORWARD, FROM, HORIZONTAL, TO } from '../Model/constants';
import Model from '../Model/Model';
import { JustSliderOptions } from '../types';
import { ScaleOptions } from '../View/Scale/types';
import View from '../View/View';
import Presenter from './Presenter';

describe('Presenter', () => {
  let presenter: Presenter;
  let eventManager: EventManager;
  let model: Model;
  let view: View;

  const onUpdate = jest.fn(() => undefined);

  const scale: ScaleOptions = {
    lines: true,
    numbers: true,
  };

  const options: JustSliderOptions = {
    scale,
    onUpdate,
    from: 0,
    to: 100,
    min: 0,
    max: 100,
    step: 10,
    orientation: HORIZONTAL,
    direction: FORWARD,
    range: false,
    tooltips: false,
    progressBar: false,
  };

  const buildPresenter = function buildPresenter() {
    eventManager = new EventManager();
    model = new Model(eventManager);
    const state = model.getState();
    const $container: JQuery<HTMLElement> = $(`
      <div class="just-slider">
      </div>
    `);
    view = new View(eventManager, state, $container);
    presenter = new Presenter(view, model, eventManager);
  };

  beforeEach(() => {
    buildPresenter();
    jest.restoreAllMocks();
  });

  test('Init model', () => {
    const mockedModelInit = jest.spyOn(model, 'init');

    presenter.init(options);

    expect(mockedModelInit).toBeCalled();
  });

  test('Init view', () => {
    const mockedViewInit = jest.spyOn(view, 'init');
    const mockedViewInitComponents = jest.spyOn(view, 'initComponents');

    presenter.init(options);

    expect(mockedViewInit).toBeCalled();
    expect(mockedViewInitComponents).toBeCalled();
  });

  test('Creates view handlers', () => {
    const mockedViewHandleHandler = jest.spyOn(view, 'addCreateHandleHandlers');
    const mockedViewSliderClickHandler = jest.spyOn(
      view,
      'addCreateSliderClickHandler'
    );

    const mockedViewScaleClickHandler = jest.spyOn(
      view,
      'addCreateScaleClickHandler'
    );

    presenter.init(options);

    expect(mockedViewHandleHandler).toBeCalled();
    expect(mockedViewSliderClickHandler).toBeCalled();
    expect(mockedViewScaleClickHandler).toBeCalled();

    const mockedUpdate = jest.spyOn(model, 'updateHandle');

    const handleHandler = mockedViewHandleHandler.mock.calls[0][0];
    const sliderClickHandler = mockedViewSliderClickHandler.mock.calls[0][0];
    const scaleClickHandler = mockedViewScaleClickHandler.mock.calls[0][0];

    handleHandler(50, FROM);
    sliderClickHandler(50, FROM);
    scaleClickHandler(50, FROM);

    expect(mockedUpdate).toBeCalledTimes(3);
  });

  test('Registers events', () => {
    const mockedRegister = jest.spyOn(eventManager, 'registerEvent');
    const events: Array<SliderEvent> = [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      SLIDER_UPDATE,
      ORIENTATION_UPDATE,
      TOOLTIPS_UPDATE,
      PROGRESS_BAR_UPDATE,
      SCALE_UPDATE,
      SLIDER_CLICK_DISABLE,
      SLIDER_CLICK_ENABLE,
      HANDLES_SWAP,
    ];

    presenter.init(options);

    events.forEach((event) => {
      expect(mockedRegister).toBeCalledWith(event);
    });
  });

  test('Dispatches events on initialization', () => {
    const mockedDispatch = jest.spyOn(eventManager, 'dispatchEvent');
    const events: Array<SliderEvent> = [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      ORIENTATION_UPDATE,
      TOOLTIPS_UPDATE,
      SCALE_UPDATE,
      SLIDER_CLICK_ENABLE,
      SLIDER_UPDATE,
    ];

    presenter.init(options);

    events.forEach((event) => {
      expect(mockedDispatch).toBeCalledWith(event);
    });
  });

  describe('Adds event listeners', () => {
    test(HANDLE_FROM_MOVE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateHandle');
      eventManager.dispatchEvent(HANDLE_FROM_MOVE);

      const type = mockedUpdate.mock.calls[0][1];
      expect(type).toBe(FROM);
      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(HANDLE_TO_MOVE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateHandle');
      eventManager.dispatchEvent(HANDLE_TO_MOVE);

      const type = mockedUpdate.mock.calls[0][1];
      expect(type).toBe(TO);
      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(PROGRESS_BAR_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateProgressBar');
      eventManager.dispatchEvent(PROGRESS_BAR_UPDATE);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(ORIENTATION_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'setOrientation');
      eventManager.dispatchEvent(ORIENTATION_UPDATE);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(TOOLTIPS_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateTooltips');
      eventManager.dispatchEvent(TOOLTIPS_UPDATE);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(SLIDER_CLICK_ENABLE, () => {
      presenter.init(options);

      const mockedHandlerSwitch = jest.spyOn(view, 'setSliderClickHandler');
      eventManager.dispatchEvent(SLIDER_CLICK_ENABLE);

      expect(mockedHandlerSwitch).toBeCalledTimes(1);
    });

    test(SLIDER_CLICK_DISABLE, () => {
      presenter.init(options);

      const mockedHandlerSwitch = jest.spyOn(view, 'removeSliderClickHandler');
      eventManager.dispatchEvent(SLIDER_CLICK_DISABLE);

      expect(mockedHandlerSwitch).toBeCalledTimes(1);
    });

    test(SLIDER_UPDATE, () => {
      presenter.init(options);

      onUpdate.mockReset();
      eventManager.dispatchEvent(SLIDER_UPDATE);

      expect(onUpdate).toBeCalledTimes(1);
    });

    test(SCALE_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateScale');
      eventManager.dispatchEvent(SCALE_UPDATE);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(HANDLES_SWAP, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'swapHandles');
      eventManager.dispatchEvent(HANDLES_SWAP);

      expect(mockedUpdate).toBeCalledTimes(1);
    });
  });

  test('Updates a handle', () => {
    const mockedUpdate = jest.spyOn(model, 'updateHandle');

    presenter.init(options);
    presenter.updateHandle(FROM, 50);

    expect(mockedUpdate).toBeCalledWith(50, FROM);
  });

  test('Updates options', () => {
    const mockedUpdate = jest.spyOn(model, 'updateOptions');
    const newOptions = {
      min: 1000,
      max: 2000,
    };

    presenter.init(options);
    presenter.updateOptions(newOptions);

    expect(mockedUpdate).toBeCalledWith(newOptions);
  });

  test('Returns slider\'s html node', () => {
    const mockedGetHtml = jest.spyOn(view, 'getHtml');

    presenter.init(options);
    const $slider = presenter.$getSlider();

    expect($slider).toEqual(mockedGetHtml.mock.results[0].value);
  });

  test('Returns slider\'s state', () => {
    const mockedGetState = jest.spyOn(model, 'getState');

    presenter.init(options);
    const state = presenter.getState();

    expect(state).toEqual(mockedGetState.mock.results[0].value);
  });
});
