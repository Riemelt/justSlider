import { HANDLE_FROM_MOVE, SLIDER_UPDATE } from './constants';
import { SliderEvent } from './types';
import EventManager from './EventManager';
import Subject from './Subject/Subject';

describe('EventManager', () => {
  let eventManager: EventManager;
  const events: Array<SliderEvent> = [SLIDER_UPDATE, HANDLE_FROM_MOVE];
  const observers: Array<() => void> = [() => undefined, () => undefined];

  beforeEach(() => {
    eventManager = new EventManager();
  });

  test('Returns event subjects', () => {
    const eventSubjects = eventManager.getEventSubjects();
    expect(eventSubjects).toBeDefined();
  });

  test('Registers event', () => {
    eventManager.registerEvent(events[0]);
    const eventSubjects = eventManager.getEventSubjects();

    expect(eventSubjects[events[0]]).toBeDefined();
  });

  test('Adds event listener', () => {
    const mock = jest
      .spyOn(Subject.prototype, 'subscribe')
      .mockImplementation(() => undefined);

    eventManager.registerEvent(events[0]);
    eventManager.addEventListener(events[0], observers[0]);
    const eventSubjects = eventManager.getEventSubjects();
    expect(eventSubjects[events[0]]?.subscribe).toHaveBeenCalledTimes(1);

    mock.mockRestore();
  });

  describe('Dispatches events', () => {
    const mockedObservers = [
      jest.fn(() => undefined),
      jest.fn(() => undefined),
    ];

    beforeEach(() => {
      mockedObservers.map((mock) => mock.mockRestore());

      eventManager.registerEvent(events[0]);
      eventManager.registerEvent(events[1]);

      eventManager.addEventListener(events[0], mockedObservers[0]);
      eventManager.addEventListener(events[1], mockedObservers[1]);
    });

    test('Dispatches single event', () => {
      eventManager.dispatchEvent(events[0]);

      expect(mockedObservers[0]).toHaveBeenCalledTimes(1);
      expect(mockedObservers[1]).toHaveBeenCalledTimes(0);
    });

    test('Dispatches multiple events', () => {
      eventManager.dispatchEvents(events);

      expect(mockedObservers[0]).toHaveBeenCalledTimes(1);
      expect(mockedObservers[1]).toHaveBeenCalledTimes(1);
    });
  });
});
