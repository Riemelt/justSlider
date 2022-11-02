import "../styles";

import Model        from "./Model/Model";
import Presenter    from "./Presenter/Presenter";
import View         from "./View/View";
import JustSlider   from "./JustSlider";
import EventManager from "./EventManager/EventManager";
import { JustSliderOptions, Options } from "./types";


(function($) {
  $.fn.extend({
    justSlider(options: JustSliderOptions) {
      const model        = new Model();
      const view         = new View();
      const presenter    = new Presenter(view, model);
      const eventManager = new EventManager;

      presenter.setEventManager(eventManager);
      presenter.init(options);

      const slider = new JustSlider(this, presenter);

      return slider;
    }
  });
}(jQuery));