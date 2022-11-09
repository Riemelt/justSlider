import EventManager from "../../EventManager/EventManager";

interface HandleOptions {
  eventManager: EventManager;
  $parent:      JQuery<HTMLElement>;
  type:         HandleType;
}

export {
  HandleOptions,
}