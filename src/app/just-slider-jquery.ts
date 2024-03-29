import Model from './Model/Model';
import Presenter from './Presenter/Presenter';
import View from './View/View';
import { ScaleOptions } from './View/Scale/types';
import JustSlider from './JustSlider/JustSlider';
import { JustSliderOptions } from './types';

(function ($) {
  $.fn.justSlider = function makeSlider(options: JustSliderOptions = {}) {
    const sliderName = 'just-slider';

    const model = new Model();

    const state = model.getState();
    const view = new View(state, this);

    const presenter = new Presenter({
      view,
      model,
    });

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
      tooltips: options.tooltips ?? this.data('tooltips'),
      scale: options.scale ?? scaleDataOptions,
    };

    presenter.init(initOptions);

    const slider = new JustSlider(this, presenter, initOptions);
    this.data(sliderName, slider);

    return this;
  };

  const $sliders = $('.just-slider');
  $sliders.each((_, element) => {
    const $element = $(element);
    $element.justSlider();
  });
}(jQuery));
