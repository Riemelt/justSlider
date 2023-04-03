import * as Utilities from '../../utilities/utilities';
import { FORWARD, FROM, HORIZONTAL } from '../../Model/constants';
import { State } from '../../types';
import { TooltipOptions } from './types';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
  let $parent: JQuery<HTMLElement>;
  let tooltip: Tooltip;

  const tooltipClass = '.just-slider__tooltip';

  const modelState: State = {
    min: -100,
    max: 300,
    from: 200,
    to: 250,
    range: false,
    orientation: HORIZONTAL,
    direction: FORWARD,
    scale: null,
    step: 10,
    progressBar: false,
    tooltips: false,
    precision: 1,
  };

  beforeEach(() => {
    $parent = $('<div class="just-slider"></div>');
    const options: TooltipOptions = {
      $parent,
      type: FROM,
      state: modelState,
    };
    tooltip = new Tooltip(options);
  });

  test('Creates html node and appends to the parent', () => {
    const $tooltip = $parent.find(tooltipClass);

    expect($tooltip.length).toBe(1);
  });

  test('Deletes html node from parent', () => {
    tooltip.delete();
    const $tooltip = $parent.find(tooltipClass);

    expect($tooltip.length).toBe(0);
  });

  test('Updates value in the html node', () => {
    const mocked = jest.spyOn(Utilities, 'getValueBasedOnPrecision');

    const from = 5;
    const precision = 0;

    tooltip.update({
      ...modelState,
      from,
      precision,
    });

    const $tooltip = $parent.find(tooltipClass);

    expect(mocked).toBeCalledWith(5, 0);
    const result = mocked.mock.results[0].value;

    expect($tooltip.html()).toBe(result);

    mocked.mockRestore();
  });
});


