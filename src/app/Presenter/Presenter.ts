import Model from '../Model/Model';
import {
  FROM,
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
import { HandleType, ModelEvent } from '../Model/types';
import EventManager from '../EventManager/EventManager';
import { JustSliderOptions, State } from '../types';
import View from '../View/View';
import { ViewEvent, ViewUpdateData } from '../View/types';
import {
  HANDLE_MOVE,
  SCALE_CLICK,
  SLIDER_CLICK,
  TOOLTIP_CLICK,
} from '../View/constants';

class Presenter {
  private modelEventManager: EventManager<ModelEvent, State>;
  private viewEventManager: EventManager<ViewEvent, ViewUpdateData>;
  private view: View;
  private model: Model;

  private onUpdate?: (state: State) => void;

  constructor({
    view,
    model,
    viewEventManager,
    modelEventManager,
  }: {
    view: View,
    model: Model,
    viewEventManager: EventManager<ViewEvent, ViewUpdateData>,
    modelEventManager: EventManager<ModelEvent, State>,
  }) {
    this.view = view;
    this.model = model;
    this.modelEventManager = modelEventManager;
    this.viewEventManager = viewEventManager;
  }

  public init({
    onUpdate,
    ...options
  }: JustSliderOptions = {}): void {
    this.model.init(options);

    const state = this.model.getState();
    this.view.init(state);

    this.setOnUpdate(onUpdate);

    this.registerEvents();
    this.addEventListeners();

    this.view.initComponents();
    this.modelEventManager.dispatchEvents(
      [
        HANDLE_FROM_MOVE,
        HANDLE_TO_MOVE,
        PROGRESS_BAR_UPDATE,
        ORIENTATION_UPDATE,
        TOOLTIPS_UPDATE,
        SCALE_UPDATE,
        SLIDER_UPDATE,
      ],
      state
    );
  }

  public getState(): State {
    return this.model.getState();
  }

  public $getSlider(): JQuery<HTMLElement> {
    return this.view.$getHtml();
  }

  public updateHandle(type: HandleType, value: number): void {
    this.model.updateHandle(value, type);
  }

  public updateOptions({
    onUpdate,
    ...options
  }: JustSliderOptions): void {
    this.model.updateOptions(options);
    this.setOnUpdate(onUpdate);
  }

  private setOnUpdate(onUpdate?: (state: State) => void): void {
    if (onUpdate) {
      this.onUpdate = onUpdate;
    }
  }

  private registerEvents(): void {
    this.registerModelEvents();
    this.registerViewEvents();
  }

  private registerViewEvents(): void {
    const events: Array<ViewEvent> = [
      HANDLE_MOVE,
      SLIDER_CLICK,
      SCALE_CLICK,
      TOOLTIP_CLICK,
    ];

    events.forEach((event) => {
      this.viewEventManager.registerEvent(event);
    });
  }

  private registerModelEvents(): void {
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

    events.forEach((event) => {
      this.modelEventManager.registerEvent(event);
    });
  }

  private addEventListeners(): void {
    this.addModelEventListeners();
    this.addViewEventListeners();
  }

  private addViewEventListeners(): void {
    const events: Array<ViewEvent> = [
      HANDLE_MOVE,
      SLIDER_CLICK,
      SCALE_CLICK,
      TOOLTIP_CLICK,
    ];

    events.forEach((event) => {
      this.viewEventManager.addEventListener(event, (data) => {
        if (data === undefined) {
          return;
        }

        const { value, handle, shouldAdjust } = data;
        this.model.updateHandle(value, handle, shouldAdjust);
      });
    });
  }

  private addModelEventListeners(): void {
    this.addEventListenerModelHandleMove(HANDLE_FROM_MOVE, FROM);
    this.addEventListenerModelHandleMove(HANDLE_TO_MOVE, TO);

    interface ViewUpdate {
      event: ModelEvent
      update: ((state: State) => void) | undefined
    }

    const viewUpdates: Array<ViewUpdate> = [
      {
        event: PROGRESS_BAR_UPDATE,
        update: (state) => this.view.updateProgressBar(state),
      },
      {
        event: ORIENTATION_UPDATE,
        update: (state) => this.view.setOrientation(state),
      },
      {
        event: TOOLTIPS_UPDATE,
        update: (state) => this.view.updateTooltips(state),
      },
      {
        event: SCALE_UPDATE,
        update: (state) => this.view.updateScale(state),
      },
      {
        event: SLIDER_UPDATE,
        update: (state) => this.onUpdate?.(state),
      },
    ];

    viewUpdates.forEach(({ event, update }) => {
      this.modelEventManager.addEventListener(event, (state) => {
        if (state === undefined) {
          return;
        }

        update?.(state);
      });
    });

    this.modelEventManager.addEventListener(HANDLES_SWAP, () => {
      this.view.swapHandles();
    });
  }

  private addEventListenerModelHandleMove(event: ModelEvent, type: HandleType) {
    this.modelEventManager.addEventListener(event, (state) => {
      if (state === undefined) {
        return;
      }

      this.view.updateHandle(state, type);
      this.view.updateTooltips(state);
    });
  }
}

export default Presenter;
