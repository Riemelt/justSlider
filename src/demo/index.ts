import '../app';
import './assets/favicons';
import Demo from './Demo';

(function ($) {
  const className = 'demo';
  const data = require('./data.json');
  const $component = $(`.js-${className}`);

  new Demo($component, data);
}(jQuery));
