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
  SLIDER_CLICK_DISABLE,
  SLIDER_CLICK_ENABLE,
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
      SLIDER_CLICK_ENABLE,
      SLIDER_UPDATE,
    ]);
  }

  public getState(): State {
    return this.model.getState();
  }

  public $getSlider(): JQuery<HTMLElement> {
    return this.view.getHtml();
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
      handle: HandleType
    ) => {
      this.model.updateHandle(value, handle);
    };

    this.view.addCreateHandleHandlers(updateHandleHandler);
    this.view.addCreateSliderClickHandler(updateHandleHandler);
    this.view.addCreateScaleClickHandler(updateHandleHandler);
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
      SLIDER_CLICK_DISABLE,
      SLIDER_CLICK_ENABLE,
      HANDLES_SWAP,
    ];

    events.forEach((event) => {
      this.eventManager.registerEvent(event);
    });
  }

  private addEventListeners(): void {
    this.eventManager.addEventListener(HANDLE_FROM_MOVE, () => {
      const state = this.model.getState();
      this.view.updateHandle(state, FROM);
      this.view.updateTooltips(state);
    });

    this.eventManager.addEventListener(HANDLE_TO_MOVE, () => {
      const state = this.model.getState();
      this.view.updateHandle(state, TO);
      this.view.updateTooltips(state);
    });

    this.eventManager.addEventListener(PROGRESS_BAR_UPDATE, () => {
      const state = this.model.getState();
      this.view.updateProgressBar(state);
    });

    this.eventManager.addEventListener(ORIENTATION_UPDATE, () => {
      const state = this.model.getState();
      this.view.setOrientation(state.orientation);
    });

    this.eventManager.addEventListener(TOOLTIPS_UPDATE, () => {
      const state = this.model.getState();
      this.view.updateTooltips(state);
    });

    this.eventManager.addEventListener(SCALE_UPDATE, () => {
      const state = this.model.getState();
      this.view.updateScale(state);
    });

    this.eventManager.addEventListener(SLIDER_CLICK_DISABLE, () => {
      this.view.removeSliderClickHandler();
    });

    this.eventManager.addEventListener(SLIDER_CLICK_ENABLE, () => {
      this.view.setSliderClickHandler();
    });

    this.eventManager.addEventListener(SLIDER_UPDATE, () => {
      const state = this.model.getState();
      this.onUpdate?.(state);
    });

    this.eventManager.addEventListener(HANDLES_SWAP, () => {
      this.view.swapHandles();
    });
  }
}

export default Presenter;
