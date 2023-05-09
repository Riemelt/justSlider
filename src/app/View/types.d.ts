import { FROM, TO } from '../Model/constants';
import { HandleType } from '../Model/types';
import {
  HANDLE_MOVE,
  SCALE_CLICK,
  SLIDER_CLICK,
  TOOLTIP_CLICK,
} from './constants';

interface SubViewSet<T> {
  from?: T,
  to?: T
}

interface CanChangeType {
  setType(type: typeof FROM | typeof TO): void
}

interface ViewUpdateData {
  value: number,
  handle: HandleType,
  shouldAdjust?: boolean,
}

type ViewEvent =
  typeof HANDLE_MOVE |
  typeof SLIDER_CLICK |
  typeof SCALE_CLICK |
  typeof TOOLTIP_CLICK;

export {
  ViewUpdateData,
  ViewEvent,
  SubViewSet,
  CanChangeType,
};
