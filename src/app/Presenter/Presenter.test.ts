import EventManager from '../EventManager/EventManager';
import { ModelEvent } from '../Model/types';
import {
  FORWARD,
  FROM,
  HORIZONTAL,
  TO,
  HANDLES_SWAP,
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  ORIENTATION_UPDATE,
  PROGRESS_BAR_UPDATE,
  SCALE_UPDATE,
  SLIDER_UPDATE,
  TOOLTIPS_UPDATE,
} from '../Model/constants';
import Model from '../Model/Model';
import { JustSliderOptions, State } from '../types';
import { ScaleOptions } from '../View/Scale/types';
import {
  HANDLE_MOVE,
  SCALE_CLICK,
  SLIDER_CLICK,
  TOOLTIP_CLICK,
} from '../View/constants';
import View from '../View/View';
import { ViewEvent, ViewUpdateData } from '../View/types';
import Presenter from './Presenter';

describe('Presenter', () => {
  let presenter: Presenter;
  let modelEventManager: EventManager<ModelEvent, State>;
  let viewEventManager: EventManager<ViewEvent, ViewUpdateData>;
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
    modelEventManager = new EventManager();
    model = new Model(modelEventManager);
    const state = model.getState();
    const $container: JQuery<HTMLElement> = $(`
      <div class="just-slider">
      </div>
    `);
    viewEventManager = new EventManager();
    view = new View(state, $container, viewEventManager);
    presenter = new Presenter({
      view,
      model,
      viewEventManager,
      modelEventManager,
    });
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

  test('Registers model events', () => {
    const mockedRegister = jest.spyOn(modelEventManager, 'registerEvent');
    const events: Array<ModelEvent> = [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      SLIDER_UPDATE,
      ORIENTATION_UPDATE,
      TOOLTIPS_UPDATE,
      PROGRESS_BAR_UPDATE,
      SCALE_UPDATE,
      HANDLES_SWAP,
    ];

    presenter.init(options);

    events.forEach((event) => {
      expect(mockedRegister).toBeCalledWith(event);
    });
  });

  test('Registers view events', () => {
    const mockedRegister = jest.spyOn(viewEventManager, 'registerEvent');
    const events: Array<ViewEvent> = [
      HANDLE_MOVE,
      SLIDER_CLICK,
      SCALE_CLICK,
      TOOLTIP_CLICK,
    ];

    presenter.init(options);

    events.forEach((event) => {
      expect(mockedRegister).toBeCalledWith(event);
    });
  });

  test('Dispatches events on initialization', () => {
    const mockedDispatch = jest.spyOn(modelEventManager, 'dispatchEvent');
    const events: Array<ModelEvent> = [
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      ORIENTATION_UPDATE,
      TOOLTIPS_UPDATE,
      SCALE_UPDATE,
      SLIDER_UPDATE,
    ];

    presenter.init(options);

    events.forEach((event, index) => {
      expect(mockedDispatch.mock.calls[index][0]).toBe(event);
    });
  });

  describe('Adds event listeners', () => {
    test(HANDLE_FROM_MOVE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateHandle');
      const state = model.getState();
      modelEventManager.dispatchEvent(HANDLE_FROM_MOVE, state);

      expect(mockedUpdate).toBeCalledWith(state, FROM);
      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(HANDLE_TO_MOVE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateHandle');
      const state = model.getState();
      modelEventManager.dispatchEvent(HANDLE_TO_MOVE, state);

      expect(mockedUpdate).toBeCalledWith(state, TO);
      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(PROGRESS_BAR_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateProgressBar');
      const state = model.getState();
      modelEventManager.dispatchEvent(PROGRESS_BAR_UPDATE, state);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(ORIENTATION_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'setOrientation');
      const state = model.getState();
      modelEventManager.dispatchEvent(ORIENTATION_UPDATE, state);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(TOOLTIPS_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateTooltips');
      const state = model.getState();
      modelEventManager.dispatchEvent(TOOLTIPS_UPDATE, state);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(SLIDER_UPDATE, () => {
      presenter.init(options);

      onUpdate.mockReset();
      const state = model.getState();
      modelEventManager.dispatchEvent(SLIDER_UPDATE, state);

      expect(onUpdate).toBeCalledTimes(1);
    });

    test(SCALE_UPDATE, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'updateScale');
      const state = model.getState();
      modelEventManager.dispatchEvent(SCALE_UPDATE, state);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    test(HANDLES_SWAP, () => {
      presenter.init(options);

      const mockedUpdate = jest.spyOn(view, 'swapHandles');
      const state = model.getState();
      modelEventManager.dispatchEvent(HANDLES_SWAP, state);

      expect(mockedUpdate).toBeCalledTimes(1);
    });

    const viewEvents: Array<ViewEvent> = [
      HANDLE_MOVE,
      SLIDER_CLICK,
      SCALE_CLICK,
      TOOLTIP_CLICK,
    ];

    viewEvents.forEach((event) => {
      test(event, () => {
        presenter.init(options);

        const mockedUpdate = jest.spyOn(model, 'updateHandle');
        viewEventManager.dispatchEvent(event, { value: 0, handle: FROM });

        expect(mockedUpdate).toBeCalledTimes(1);
      });
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
    const $getHtmlMocked = jest.spyOn(view, '$getHtml');

    presenter.init(options);
    const $slider = presenter.$getSlider();

    expect($slider).toEqual($getHtmlMocked.mock.results[0].value);
  });

  test('Returns slider\'s state', () => {
    const mockedGetState = jest.spyOn(model, 'getState');

    presenter.init(options);
    const state = presenter.getState();

    expect(state).toEqual(mockedGetState.mock.results[0].value);
  });
});
