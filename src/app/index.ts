import "../styles";

import Model     from "./Model/Model";
import Presenter from "./Presenter/Presenter";
import View      from "./View/View";

(function($) {
  $.fn.extend({
    justSlider(options: Options) {
      const model = new Model();
      const view = new View();
      const presenter = new Presenter(view, model, options);

      const $html = presenter.getView().getHtml();
      this.append($html);
    }
  });
}(jQuery));