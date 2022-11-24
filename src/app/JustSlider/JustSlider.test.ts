import JustSlider   from "./JustSlider";
import Presenter    from "../Presenter/Presenter";
import EventManager from "../EventManager/EventManager";
import Model        from "../Model/Model";
import View         from "../View/View";
import { JustSliderOptions } from "../types";

describe("JustSlider", () => {
  let justSlider: JustSlider;
  let $parent: JQuery<HTMLElement>;

  let eventManager: EventManager;
  let model:        Model;
  let view:         View;
  let presenter:    Presenter;

  const onUpdate = jest.fn(() => undefined);
  
  const options: JustSliderOptions = {
    from:        0,
    to:          100,
    min:         0,
    max:         100,
    step:        10,
    orientation: "horizontal",
    direction:   "forward",
    range:       false,
    tooltips:    false,
    progressBar: false,
    onUpdate,
  }

  function initSlider(options: JustSliderOptions) {
    presenter.init(options);
    justSlider = new JustSlider($parent, presenter, options);
  }

  beforeEach(() => {
    $parent = $(`<div class="slider"></div>`);
    eventManager = new EventManager();
    model        = new Model(eventManager);
    view         = new View(eventManager);
    presenter    = new Presenter(view, model, eventManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Appends HTML node of slider", () => {
    initSlider(options);

    const sliderClass = ".just-slider";

    const $slider = $parent.find(sliderClass);

    expect($slider.length).toBe(1);
  });

  describe("API", () => {
    test("update", () => {
      initSlider(options);
      const mockedUpdate = jest.spyOn(presenter, "updateHandle");
      justSlider.update("from", 100);

      expect(mockedUpdate).toBeCalledWith("from", 100);
    });

    test("updateOptions", () => {
      initSlider(options);
      const mockedUpdate = jest.spyOn(presenter, "updateOptions");
      justSlider.updateOptions({
        min: 50,
        max: 150,
      });

      expect(mockedUpdate).toBeCalledWith({
        min: 50,
        max: 150,
      });
    });

    test("$slider", () => {
      initSlider(options);
      const mockedGetSlider = jest.spyOn(presenter, "$getSlider");
      const $slider = justSlider.$slider();
  
      expect($slider).toEqual(mockedGetSlider.mock.results[0].value);
    });

    describe("get", () => {
      test("Range is true", () => {
        initSlider({ ...options, range: true });

        const values = justSlider.get();
        expect(typeof values).toBe("object");

        if (typeof values === "object") {
          const [from, to] = values;
          expect(from).toBe(0);
          expect(to).toBe(100);
        }
      });

      test("Range is false", () => {
        initSlider(options);

        const from = justSlider.get();
        expect(from).toBe(0);
      });
    });

    test("getState", () => {
      initSlider(options);

      const mockedGetState = jest.spyOn(presenter, "getState");
      const state = justSlider.getState();
  
      expect(state).toEqual(mockedGetState.mock.results[0].value);
    });

    test("reset", () => {
      initSlider(options);

      justSlider.update("from", 50);
      justSlider.reset();
      const from = justSlider.get();

      expect(from).toBe(0);
    });
  });
});