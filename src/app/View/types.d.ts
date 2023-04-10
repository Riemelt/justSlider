import { FROM, TO } from '../Model/constants';

interface SubViewSet<T> {
  from?: T,
  to?: T
}

interface CanChangeType {
  setType(type: typeof FROM | typeof TO): void
}

export {
  SubViewSet,
  CanChangeType,
};
