import Tooltip from './Tooltip';
import * as Utilities from '../../utilities/utilities';

describe('Tooltip', () => {
  let $parent: JQuery<HTMLElement>;
  let tooltip: Tooltip;

  const tooltipClass = '.just-slider__tooltip';

  beforeEach(() => {
    $parent = $('<div class="just-slider"></div>');
    tooltip = new Tooltip($parent);
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

    const value = 5;
    const precision = 0;

    tooltip.update(value, precision);

    const $tooltip = $parent.find(tooltipClass);

    expect(mocked).toBeCalledWith(5, 0);
    const result = mocked.mock.results[0].value;

    expect($tooltip.html()).toBe(result);

    mocked.mockRestore();
  });
});


