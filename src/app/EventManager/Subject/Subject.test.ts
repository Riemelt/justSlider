import Subject from './Subject';

describe('Subject', () => {
  let subject: Subject<null>;
  let observer: () => void;

  beforeEach(() => {
    subject = new Subject();
    observer = () => undefined;
  });

  test('Subscribes new observer', () => {
    subject.subscribe(observer);

    expect(subject.observers).toContain(observer);
  });

  test('Unsubscribes observer', () => {
    subject.subscribe(observer);
    subject.unsubscribe(observer);

    expect(subject.observers).not.toContain(observer);
  });
});
