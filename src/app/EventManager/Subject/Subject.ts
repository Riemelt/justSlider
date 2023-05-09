class Subject<TData> {
  public observers: Array<(data?: TData) => void>;

  constructor() {
    this.observers = [];
  }

  public subscribe(observer: (data?: TData) => void): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: (data?: TData) => void): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
}

export default Subject;
