import EventManager from "../../EventManager/EventManager";
import {
  HandleType,
} from "../../Model/types";
import {
  State,
} from "../../types";

interface HandleOptions {
  eventManager: EventManager;
  $parent:      JQuery<HTMLElement>;
  type:         HandleType;
  state:        State,
}

export {
  HandleOptions,
}