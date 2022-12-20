import Subject from './Subject/Subject';
import {
  EventSubjects,
  SliderEvent,
} from './types';

class EventManager {
  private eventsSubjects: EventSubjects;

  constructor() {
    this.eventsSubjects = {};
  }

  public getEventSubjects(): EventSubjects {
    return this.eventsSubjects;
  }

  public registerEvent(eventName: SliderEvent): void {
    this.eventsSubjects[eventName] = new Subject();
  }

  public dispatchEvent(eventName: SliderEvent): void {
    this.eventsSubjects[eventName]?.observers.forEach((observer) => observer());
  }

  public dispatchEvents(eventNames: Array<SliderEvent>): void {
    eventNames.forEach((eventName) => {
      this.dispatchEvent(eventName);
    });
  }

  public addEventListener(eventName: SliderEvent, observer: () => void): void {
    this.eventsSubjects[eventName]?.subscribe(observer);
  }
}

export default EventManager;
