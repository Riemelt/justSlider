import Model        from "../Model/Model";
import View         from "../View/View";
import EventManager from "../EventManager/EventManager";

class Presenter {
  private view: View;
  private model: Model;
  private eventManager: EventManager;

  public $getSlider(): JQuery<HTMLElement> {
    return this.view.getHtml();
  }

  constructor(view: View, model: Model, options: Options) {
    console.log("Presenter created");

    this.eventManager = new EventManager();

    this.view = view;
    this.model = model;

    this.model.setEventManager(this.eventManager);

    this.model.init(options);
    const data = this.model.getOptions();

    this.view.init(data);
    this.view.initComponents();
    
    this.view.addCreateHandleHandlers((value: number, handle: HandleType) => {
      this.model.setHandle(value, handle);
    });

    this.view.addCreateSliderClickHandler((value: number, handle: HandleType) => {
      this.model.setHandle(value, handle);
    });

    this.registerEvents();
    this.addEventListeners();
  }

  private registerEvents() {
    this.eventManager.registerEvent("HandleFromMove");
    this.eventManager.registerEvent("HandleToMove");
  }

  private addEventListeners() {
    this.eventManager.addEventListener("HandleFromMove", () => {
      const options = this.model.getOptions();
      this.view.updateHandle(options, "from");
      this.view.updateProgressBar(options);
    });

    this.eventManager.addEventListener("HandleToMove", () => {
      const options = this.model.getOptions();
      this.view.updateHandle(options, "to");
      this.view.updateProgressBar(options);
    });
  }
}

export default Presenter;