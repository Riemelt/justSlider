import { TooltipType } from '../../Model/types';
import { State } from '../../types';

interface TooltipOptions {
  $parent: JQuery<HTMLElement>;
  type: TooltipType;
  state: State,
}

export {
  TooltipOptions,
};
