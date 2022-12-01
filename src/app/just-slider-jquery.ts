import Model                 from "./Model/Model";
import Presenter             from "./Presenter/Presenter";
import View                  from "./View/View";
import JustSlider            from "./JustSlider/JustSlider";
import EventManager          from "./EventManager/EventManager";
import {
  JustSliderOptions,
} from "./types";

(function($) {
  $.fn.justSlider = function makeSlider(options: JustSliderOptions = {}) {
    const sliderName = "just-slider";

    const eventManager = new EventManager;
    const model        = new Model(eventManager);
    const state        = model.getState();
    const view         = new View(eventManager, state);
    const presenter    = new Presenter(view, model, eventManager);

    presenter.init(options);

    const slider = new JustSlider(this, presenter, options);
    this.data(sliderName, slider);

    return this;
  };
})(jQuery);