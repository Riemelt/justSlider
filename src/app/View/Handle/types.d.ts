import { HandleType } from '../../Model/types';
import { State } from '../../types';

interface HandleOptions {
  $parent: JQuery<HTMLElement>;
  type: HandleType;
  state: State,
}

export {
  HandleOptions,
};
