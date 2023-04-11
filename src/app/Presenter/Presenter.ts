import Model from '../Model/Model';
import { FROM, TO } from '../Model/constants';
import { HandleType } from '../Model/types';
import View from '../View/View';
import EventManager from '../EventManager/EventManager';
import { SliderEvent } from '../EventManager/types';
import {
  HANDLES_SWAP,
  HANDLE_FROM_MOVE,
  HANDLE_TO_MOVE,
  ORIENTATION_UPDATE,
  PROGRESS_BAR_UPDATE,
  SCALE_UPDATE,
  SLIDER_UPDATE,
  TOOLTIPS_UPDATE,
} from '../EventManager/constants';
import { JustSliderOptions, State } from '../types';

class Presenter {
  private eventManager: EventManager;
  private view: View;
  private model: Model;

  private onUpdate?: (state: State) => void;

  constructor(view: View, model: Model, eventManager: EventManager) {
    this.view = view;
    this.model = model;
    this.eventManager = eventManager;
  }

  public init({
    onUpdate,
    ...options
  }: JustSliderOptions = {}): void {
    this.model.init(options);

    const state = this.model.getState();
    this.view.init(state);

    this.setOnUpdate(onUpdate);

    this.createHandlers();
    this.registerEvents();
    this.addEventListeners();

    this.view.initComponents();
    this.eventManager.dispatchEvents([
      HANDLE_FROM_MOVE,
      HANDLE_TO_MOVE,
      PROGRESS_BAR_UPDATE,
      ORIENTATION_UPDATE,
      TOOLTIPS_UPDATE,
      SCALE_UPDATE,
      SLIDER_UPDATE,
    ]);
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

  private createHandlers(): void {
    const updateHandleHandler = (
      value: number,
      handle: HandleType,
      shouldAdjust?: boolean,
    ) => {
      this.model.updateHandle(value, handle, shouldAdjust);
    };

    const handlerSetters = [
      this.view.addHandleMoveHandler.bind(this.view),
      this.view.addSliderClickHandler.bind(this.view),
      this.view.addScaleClickHandler.bind(this.view),
      this.view.addTooltipClickHandler.bind(this.view),
    ];

    handlerSetters.forEach((setter) => {
      setter(updateHandleHandler);
    });
  }

  private registerEvents(): void {
    const events: Array<SliderEvent> = [
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
      this.eventManager.registerEvent(event);
    });
  }

  private addEventListeners(): void {
    this.addEventListenerHandleMove(HANDLE_FROM_MOVE, FROM);
    this.addEventListenerHandleMove(HANDLE_TO_MOVE, TO);

    interface ViewUpdate {
      event: SliderEvent
      update: ((state: State) => void) | undefined
    }

    const viewUpdates: Array<ViewUpdate> = [
      {
        event: PROGRESS_BAR_UPDATE,
        update: this.view.updateProgressBar.bind(this.view),
      },
      {
        event: ORIENTATION_UPDATE,
        update: this.view.setOrientation.bind(this.view),
      },
      {
        event: TOOLTIPS_UPDATE,
        update: this.view.updateTooltips.bind(this.view),
      },
      {
        event: SCALE_UPDATE,
        update: this.view.updateScale.bind(this.view),
      },
      {
        event: SLIDER_UPDATE,
        update: this.onUpdate?.bind(this),
      },
    ];

    viewUpdates.forEach(({ event, update }) => {
      this.eventManager.addEventListener(event, () => {
        const state = this.model.getState();
        update?.(state);
      });
    });

    this.eventManager.addEventListener(HANDLES_SWAP, () => {
      this.view.swapHandles();
    });
  }

  private addEventListenerHandleMove(event: SliderEvent, type: HandleType) {
    this.eventManager.addEventListener(event, () => {
      const state = this.model.getState();
      this.view.updateHandle(state, type);
      this.view.updateTooltips(state);
    });
  }
}

export default Presenter;
