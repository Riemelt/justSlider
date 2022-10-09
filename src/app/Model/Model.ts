import EventManager from "../EventManager/EventManager";

class Model {
  private options: Options;
  private eventManager: EventManager;

  constructor() {
    console.log("Model created");
  }

  init(options: Options) {
    this.options = options;
    return options;
  }

  setEventManager(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

}

export default Model;