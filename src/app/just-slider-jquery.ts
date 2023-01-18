import Model from './Model/Model';
import Presenter from './Presenter/Presenter';
import View from './View/View';
import { ScaleOptions } from './View/Scale/types';
import JustSlider from './JustSlider/JustSlider';
import EventManager from './EventManager/EventManager';
import {
  JustSliderOptions,
} from './types';

(function ($) {
  $.fn.justSlider = function makeSlider(options: JustSliderOptions = {}) {
    const sliderName = 'just-slider';

    const eventManager = new EventManager;
    const model = new Model(eventManager);
    const state = model.getState();
    const view = new View(eventManager, state);
    const presenter = new Presenter(view, model, eventManager);

    let scaleDataOptions: ScaleOptions | null = null;

    if (this.data('scale')) {
      scaleDataOptions = {
        density: this.data('scale-density'),
        numbers: this.data('scale-numbers'),
        lines: this.data('scale-lines'),
      };
    }

    const initOptions: JustSliderOptions = {
      ...options,
      min: options.min ?? this.data('min'),
      max: options.max ?? this.data('max'),
      step: options.step ?? this.data('step'),
      from: options.from ?? this.data('from'),
      to: options.to ?? this.data('to'),
      orientation: options.orientation ?? this.data('orientation'),
      direction: options.direction ?? this.data('direction'),
      range: options.range ?? this.data('range'),
      progressBar: options.progressBar ?? this.data('progress-bar'),
      precision: options.precision ?? this.data('precision'),
      tooltips: options.tooltips ?? this.data('tooltips'),
      scale: options.scale ?? scaleDataOptions,
    };

    presenter.init(initOptions);

    const slider = new JustSlider(this, presenter, initOptions);
    this.data(sliderName, slider);

    return this;
  };
}(jQuery));
