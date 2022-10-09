class Subject {
  public observers: Array<() => void>;
  
  private name: SliderEvent;

  constructor(event: SliderEvent) {
    this.observers = [];
    this.name = event;
  }

  subscribe(observer: () => void) {
    this.observers.push(observer);
  }

  unsubscribe(observer: () => void) {
    this.observers.filter(obs => obs !== observer);
  }
}

export default Subject;