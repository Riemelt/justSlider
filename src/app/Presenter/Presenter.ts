import Model        from "../Model/Model";
import View         from "../View/View";
import EventManager from "../EventManager/EventManager";
import { Direction, Options, Orientation }  from "../types";

class Presenter {
  private view: View;
  private model: Model;
  private eventManager: EventManager;

  constructor(view: View, model: Model, options: Options) {
    this.eventManager = new EventManager();

    this.view = view;
    this.model = model;

    this.model.setEventManager(this.eventManager);
    this.model.init(options);
    
    const data = this.model.getOptions();

    this.view.init(data);
    this.view.initComponents();
    
    this.createHandlers();

    this.registerEvents();
    this.addEventListeners();
  }

  public $getSlider(): JQuery<HTMLElement> {
    return this.view.getHtml();
  }

  public updateTooltips(value: boolean) {
    this.model.updateTooltips(value);
  }

  public updateRange(value: boolean) {
    this.model.updateRange(value);
  }

  public updateProgressBar(value: boolean) {
    this.model.updateProgressBar(value);
  }

  public updateDirection(value: Direction) {
    this.model.updateDirection(value);
  }

  public updateOrientation(value: Orientation) {
    this.model.updateOrientation(value);
  }

  public updateStep(value: number) {
    this.model.updateStep(value);
  }

  public updateMax(value: number) {
    this.model.updateMax(value);
  }

  public updateMin(value: number) {
    this.model.updateMin(value);
  }

  public updateHandle(type: HandleType, value: number) {
    this.model.updateHandle(value, type);
  }

  public updateOptions(options: Options) {
    this.model.updateOptions(options);
  }

  private createHandlers() {
    this.view.addCreateHandleHandlers((value: number, handle: HandleType) => {
      this.model.updateHandle(value, handle);
    });

    this.view.addCreateSliderClickHandler((value: number, handle: HandleType) => {
      this.model.updateHandle(value, handle);
    });
  }

  private registerEvents() {
    this.eventManager.registerEvent("HandleFromMove");
    this.eventManager.registerEvent("HandleToMove");
    this.eventManager.registerEvent("SliderUpdate");
    this.eventManager.registerEvent("MinChange");
    this.eventManager.registerEvent("MaxChange");
    this.eventManager.registerEvent("StepChange");
    this.eventManager.registerEvent("OrientationChange");
    this.eventManager.registerEvent("DirectionChange");
    this.eventManager.registerEvent("TooltipsChange");
    this.eventManager.registerEvent("RangeChange");
  }

  private addEventListeners() {
    this.eventManager.addEventListener("HandleFromMove", () => {
      const options = this.model.getOptions();
      this.view.updateHandleFrom(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("HandleToMove", () => {
      const options = this.model.getOptions();
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("SliderUpdate", () => {
      const options = this.model.getOptions();
      this.view.setOrientation(options.orientation);
      this.view.updateHandleFrom(options);
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("MinChange", () => {
      const options = this.model.getOptions();
      this.view.updateHandleFrom(options);
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("MaxChange", () => {
      const options = this.model.getOptions();
      this.view.updateHandleFrom(options);
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("StepChange", () => {
      const options = this.model.getOptions();
      this.view.updateHandleFrom(options);
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("OrientationChange", () => {
      const options = this.model.getOptions();
      this.view.setOrientation(options.orientation);
      this.view.updateHandleFrom(options);
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("DirectionChange", () => {
      const options = this.model.getOptions();
      this.view.updateHandleFrom(options);
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("RangeChange", () => {
      const options = this.model.getOptions();
      this.view.updateHandleTo(options);
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("TooltipsChange", () => {
      const options = this.model.getOptions();
      this.view.updateTooltips(options);
    });
  }
}

export default Presenter;