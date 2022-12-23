// Note: load ssource styles directly in Pug via require()
// import './styles/demo.scss';

import '../demo/assets/favicons';
import '../app';
import Demo from './Demo';

(function ($) {
  const className = 'demo';
  const data = require('./data.json');
  const $component = $(`.js-${className}`);

  new Demo($component, data);
}(jQuery));
