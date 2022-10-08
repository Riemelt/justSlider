import Model     from "./Model";
import Presenter from "./Presenter";
import View      from "./View";

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