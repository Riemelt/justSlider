import { TooltipType } from '../../Model/types';

interface TooltipOptions {
  $parent: JQuery<HTMLElement>;
  type: TooltipType;
}

export {
  TooltipOptions,
};
