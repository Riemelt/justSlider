import Subject from "./Subject/Subject";
import { EventSubjects } from "./types";

class EventManager {
  private eventsSubjects: EventSubjects;

  constructor() {
    this.eventsSubjects = {};
  }

  registerEvent(eventName: SliderEvent) {
    const eventSubject = new Subject(eventName);
    this.eventsSubjects[eventName] = eventSubject;
  }

  dispatchEvent(eventName: SliderEvent) {
    this.eventsSubjects[eventName].observers.forEach(observer => observer());
  }

  addEventListener(eventName: SliderEvent, observer: () => void) {
    this.eventsSubjects[eventName].subscribe(observer);
  }
}

export default EventManager;