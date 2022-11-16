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

  beforeEach(() => {
    $parent = $(`<div class="slider"></div>`);
    eventManager = new EventManager();
    model        = new Model(eventManager);
    view         = new View(eventManager);
    presenter    = new Presenter(view, model, eventManager);

    presenter.init(options);

    justSlider = new JustSlider($parent, presenter)
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Appends HTML node of slider", () => {
    const sliderClass = ".just-slider";

    const $slider = $parent.find(sliderClass);

    expect($slider.length).toBe(1);
  });

  describe("API", () => {
    test("updateHandle", () => {
      const mockedUpdate = jest.spyOn(presenter, "updateHandle");
      justSlider.updateHandle("from", 100);

      expect(mockedUpdate).toBeCalledWith("from", 100);
    });

    test("updateOptions", () => {
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
  });
});