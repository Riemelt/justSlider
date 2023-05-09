import Subject from './Subject/Subject';

class EventManager<TEvent extends string, TData = null> {
  private eventsSubjects: Partial<Record<TEvent, Subject<TData>>>;

  constructor() {
    this.eventsSubjects = {};
  }

  public getEventSubjects(): Partial<Record<TEvent, Subject<TData>>> {
    return this.eventsSubjects;
  }

  public registerEvent(eventName: TEvent): void {
    this.eventsSubjects[eventName] = new Subject();
  }

  public dispatchEvent(eventName: TEvent, data?: TData): void {
    this.eventsSubjects[eventName]?.observers.forEach((observer) => {
      observer(data);
    });
  }

  public dispatchEvents(eventNames: Array<TEvent>, data?: TData): void {
    eventNames.forEach((eventName) => {
      this.dispatchEvent(eventName, data);
    });
  }

  public addEventListener(
    eventName: TEvent,
    observer: (data?: TData) => void
  ): void {
    this.eventsSubjects[eventName]?.subscribe(observer);
  }
}

export default EventManager;
