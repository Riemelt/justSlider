class Subject {
  public observers: Array<() => void>;

  constructor() {
    this.observers = [];
  }

  public subscribe(observer: () => void): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: () => void): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
}

export default Subject;
