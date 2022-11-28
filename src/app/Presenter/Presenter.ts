import Model        from "../Model/Model";
import View         from "../View/View";
import EventManager from "../EventManager/EventManager";
import { JustSliderOptions, Options, State }  from "../types";
import { HandleType } from "../Model/types";

class Presenter {
  private eventManager: EventManager;
  private view:         View;
  private model:        Model;

  private onUpdate: (options: Options) => void;

  constructor(view: View, model: Model, eventManager: EventManager) {
    this.view         = view;
    this.model        = model;
    this.eventManager = eventManager;
  }

  public init({
    onUpdate,
    ...options
  }: JustSliderOptions) {
    this.model.init(options);

    const data = this.model.getState();

    this.view.init(data);

    this.setOnUpdate(onUpdate);

    this.createHandlers();
    this.registerEvents();
    this.addEventListeners();

    this.view.initComponents();
    this.eventManager.dispatchEvents([
      "HandleFromMove",
      "HandleToMove",
      "ProgressBarUpdate",
      "OrientationUpdate",
      "TooltipsUpdate",
      "ScaleUpdate",
      "SliderClickEnable",
      "SliderUpdate",
    ]);
  }

  public getState(): State {
    return this.model.getState();
  }

  public $getSlider(): JQuery<HTMLElement> {
    return this.view.getHtml();
  }

  public updateHandle(type: HandleType, value: number) {
    this.model.updateHandle(value, type);
  }

  public updateOptions({
    onUpdate,
    ...options
  }: JustSliderOptions): void {
    this.model.updateOptions(options);
    this.setOnUpdate(onUpdate);
  }

  private setOnUpdate(onUpdate?: (state: State) => void) {
    if (onUpdate) {
      this.onUpdate = onUpdate;
    }
  }

  private createHandlers() {
    this.view.addCreateHandleHandlers((value: number, handle: HandleType) => {
      this.model.updateHandle(value, handle);
    });

    this.view.addCreateSliderClickHandler((value: number, handle: HandleType) => {
      this.model.updateHandle(value, handle);
    });

    this.view.addCreateScaleClickHandler((value: number, handle: HandleType) => {
      this.model.updateHandle(value, handle);
    });
  }

  private registerEvents() {
    this.eventManager.registerEvent("HandleFromMove");
    this.eventManager.registerEvent("HandleToMove");
    this.eventManager.registerEvent("SliderUpdate");
    this.eventManager.registerEvent("OrientationUpdate");
    this.eventManager.registerEvent("TooltipsUpdate");
    this.eventManager.registerEvent("ProgressBarUpdate");
    this.eventManager.registerEvent("ScaleUpdate");
    this.eventManager.registerEvent("SliderClickDisable");
    this.eventManager.registerEvent("SliderClickEnable");
  }

  private addEventListeners() {
    this.eventManager.addEventListener("HandleFromMove", () => {
      const state = this.model.getState();
      this.view.updateHandle(state, "from");
    });

    this.eventManager.addEventListener("HandleToMove", () => {
      const state = this.model.getState();
      this.view.updateHandle(state, "to");
    });

    this.eventManager.addEventListener("ProgressBarUpdate", () => {
      const state = this.model.getState();
      this.view.updateProgressBar(state);
    });

    this.eventManager.addEventListener("OrientationUpdate", () => {
      const state = this.model.getState();
      this.view.setOrientation(state.orientation);
    });

    this.eventManager.addEventListener("TooltipsUpdate", () => {
      const state = this.model.getState();
      this.view.updateTooltips(state);
    });
    
    this.eventManager.addEventListener("ScaleUpdate", () => {
      const state = this.model.getState();
      this.view.updateScale(state);
    });

    this.eventManager.addEventListener("SliderClickDisable", () => {
      this.view.removeSliderClickHandler();
    });

    this.eventManager.addEventListener("SliderClickEnable", () => {
      this.view.setSliderClickHandler();
    });

    this.eventManager.addEventListener("SliderUpdate", () => {
      const state = this.model.getState();
      this.onUpdate?.(state);
    });
  }
}

export default Presenter;