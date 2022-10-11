class Subject {
  public observers: Array<() => void>;
  
  private name: SliderEvent;

  constructor(event: SliderEvent) {
    this.observers = [];
    this.name = event;
  }

  public subscribe(observer: () => void) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: () => void) {
    this.observers.filter(obs => obs !== observer);
  }
}

export default Subject;