import Model        from "../Model/Model";
import View         from "../View/View";
import EventManager from "../EventManager/EventManager";

class Presenter {
  private view: View;
  private model: Model;
  private eventManager: EventManager;

  getView(): View {
    return this.view;
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
    this.view.startComponents();
  }

}

export default Presenter;