import Model        from "../Model/Model";
import View         from "../View/View";
import EventManager from "../EventManager/EventManager";
import { Direction, JustSliderOptions, Options, Orientation }  from "../types";

class Presenter {
  private view: View;
  private model: Model;
  private eventManager: EventManager;

  private onUpdate: (options: Options) => void;

  constructor(view: View, model: Model, {
    onUpdate,
    ...options
  }: JustSliderOptions) {
    this.eventManager = new EventManager();

    this.view = view;
    this.model = model;

    this.model.setEventManager(this.eventManager);
    this.model.init(options);

    const data = this.model.getOptions();

    this.view.init(data);

    this.onUpdate = onUpdate;

    this.createHandlers();
    this.registerEvents();
    this.addEventListeners();

    this.view.initComponents();
    this.eventManager.dispatchEvents(["HandleFromMove", "HandleToMove", "ProgressBarUpdate", "OrientationUpdate", "TooltipsUpdate", "SliderUpdate"]);
  }

  public $getSlider(): JQuery<HTMLElement> {
    return this.view.getHtml();
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
    this.eventManager.registerEvent("OrientationUpdate");
    this.eventManager.registerEvent("TooltipsUpdate");
    this.eventManager.registerEvent("ProgressBarUpdate");
  }

  private addEventListeners() {
    this.eventManager.addEventListener("HandleFromMove", () => {
      const options = this.model.getOptions();
      this.view.updateHandleFrom(options);
    });

    this.eventManager.addEventListener("HandleToMove", () => {
      const options = this.model.getOptions();
      this.view.updateHandleTo(options);
    });

    this.eventManager.addEventListener("ProgressBarUpdate", () => {
      const options = this.model.getOptions();
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("OrientationUpdate", () => {
      const options = this.model.getOptions();
      this.view.setOrientation(options.orientation);
    });

    this.eventManager.addEventListener("TooltipsUpdate", () => {
      const options = this.model.getOptions();
      this.view.updateTooltips(options);
    });

    this.eventManager.addEventListener("SliderUpdate", () => {
      const options = this.model.getOptions();
      this.onUpdate?.(options);
    });
  }
}

export default Presenter;