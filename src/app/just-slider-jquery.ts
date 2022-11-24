import Model                 from "./Model/Model";
import Presenter             from "./Presenter/Presenter";
import View                  from "./View/View";
import JustSlider            from "./JustSlider/JustSlider";
import EventManager          from "./EventManager/EventManager";
import { JustSliderOptions } from "./types";

(function($) {
  $.fn.extend({
    justSlider(options: JustSliderOptions) {
      const eventManager = new EventManager;
      const model        = new Model(eventManager);
      const view         = new View(eventManager);
      const presenter    = new Presenter(view, model, eventManager);

      presenter.init(options);

      const slider = new JustSlider(this, presenter, options);

      return slider;
    }
  });
}(jQuery));