import Model from "./Model";
import View  from "./View";

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
  }

}

export default Presenter;