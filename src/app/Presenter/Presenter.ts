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

    const data = this.model.init(options);
    this.view.init(data);
    this.view.initHtml();
    this.view.initComponents();
    
    this.view.addCreateHandleHandler((value: number, handle: HandleType) => {
      this.model.setHandle(value, handle);
    })

    this.registerEvents();
    this.addEventListeners();
  }

  private registerEvents() {
    this.eventManager.registerEvent("HandleMove");
  }

  private addEventListeners() {
    this.eventManager.addEventListener("HandleMove", () => {
      const options = this.model.getOptions();
      this.view.updateHandle(options);
    });
  }
}

export default Presenter;