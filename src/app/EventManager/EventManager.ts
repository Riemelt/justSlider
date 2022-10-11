import Subject from "./Subject/Subject";
import { EventSubjects } from "./types";

class EventManager {
  private eventsSubjects: EventSubjects;

  constructor() {
    this.eventsSubjects = {};
  }

  public registerEvent(eventName: SliderEvent) {
    const eventSubject = new Subject(eventName);
    this.eventsSubjects[eventName] = eventSubject;
  }

  public dispatchEvent(eventName: SliderEvent) {
    this.eventsSubjects[eventName].observers.forEach(observer => observer());
  }

  public addEventListener(eventName: SliderEvent, observer: () => void) {
    this.eventsSubjects[eventName].subscribe(observer);
  }
}

export default EventManager;