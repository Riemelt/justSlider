import EventManager from "../../EventManager/EventManager";
import { HandleType } from "../../Model/types";

interface HandleOptions {
  eventManager: EventManager;
  $parent:      JQuery<HTMLElement>;
  type:         HandleType;
}

export {
  HandleOptions,
}