import Model from "../Model/Model";
import View  from "../View/View";

class Presenter {
  private view: View;
  private model: Model;

  getView(): View {
    return this.view;
  }

  constructor(view: View, model: Model, options: Options) {
    console.log("Presenter created");

    this.view = view;
    this.model = model;

    const data = this.model.init(options);
    this.view.init(data);
    this.view.initHtml();
    this.view.initComponents();
    this.view.startComponents();
  }

}

export default Presenter;