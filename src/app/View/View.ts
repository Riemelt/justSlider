import EventManager from "../EventManager/EventManager";
import { Options, Orientation } from "../types";
import Handle                   from "./Handle/Handle";
import ProgressBar              from "./ProgressBar/ProgressBar";

import { convertViewPositionToModel } from "./utilities";

class View {
  private eventManager: EventManager;
  private options:      Options;
  private $html:        JQuery<HTMLElement>;
  private $justSlider:  JQuery<HTMLElement>;

  private handleHandleMousemove: (position: number, type: HandleType) => void;
  private sliderClickHandler:    (position: number, type: HandleType) => void;

  private handles: {
    from: Handle,
    to:   Handle,
  };

  private progressBar: ProgressBar;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  public getHtml() {
    return this.$html;
  }

  public init(options: Options) {
    this.options = options;
    this.handles = { from: undefined, to: undefined };
    this.initHtml();
  }

  public setOrientation(orientation: Orientation) {
    if (orientation === "vertical") {
      this.$html.addClass("just-slider_vertical");
      return;
    }

    this.$html.removeClass("just-slider_vertical");
  }

  public initComponents() {
    this.initHandle("from");
  }

  public updateHandleFrom(options: Options) {
    this.handles.from.update(options);
  }

  public updateHandleTo(options: Options) {
    const { range } = options;

    if (range) {
      if (!this.handles.to) {
        this.initHandle("to");
      }

      this.handles.to.update(options);
      return;
    }

    if (!this.handles.to) return;
    
    this.deleteHandle("to");
  }

  public updateTooltips(options: Options) {
    this.handles.from?.updateTooltip(options);
    this.handles.to?.updateTooltip(options);
  }

  public updateProgressBar(options: Options) {
    const { progressBar } = options;

    if (progressBar) {
      if (!this.progressBar) {
        this.progressBar = new ProgressBar(this.$justSlider);
      }

      this.progressBar.update(options);
      return;
    }

    if (!this.progressBar) return;

    this.deleteProgressBar();
  }

  public deleteProgressBar() {
    this.progressBar?.delete();
    delete this.progressBar;
  }

  public deleteHandle(type: HandleType) {
    this.handles[type]?.delete();
    delete this.handles[type];
  }

  public addCreateHandleHandlers(handler: (value: number, type: HandleType) => void) {
    this.handleHandleMousemove = (position, type) => {
      handler(position, type);
    }
  }

  public addCreateSliderClickHandler(handler: (value: number, type: HandleType) => void) {
    this.sliderClickHandler = handler;
  }

  public setSliderClickHandler() {
    this.$html.addClass("just-slider_animated");
    this.$justSlider.on("mousedown.slider", this.handleSliderClick.bind(this));
  }

  public removeSliderClickHandler() {
    this.$html.removeClass("just-slider_animated");
    this.$justSlider.off("mousedown.slider");
  }

  private handleSliderClick(event: MouseEvent) {
    const position = this.options.orientation === "horizontal" ? event.pageX : event.pageY;
    const { min, max, orientation, direction, from, to, range } = this.options;

    const length = orientation === "horizontal" ? this.$justSlider.width() : this.$justSlider.height();
    const shift = orientation === "horizontal" ? this.$justSlider.offset().left : this.$justSlider.offset().top;

    const converted = convertViewPositionToModel({
      position,
      min,
      max,
      orientation,
      direction,
      length,
      shift,
    });

    const distanceToTo = Math.abs(to - converted);
    const distanceToFrom = Math.abs(from - converted);
    const type = distanceToTo > distanceToFrom || !range ? "from" : "to";

    this.sliderClickHandler(converted, type);
  }

  private initHtml() {
    this.$html = $(`
      <div class="just-slider">
        <div class="just-slider__main">
        </div>
      </div>
    `);

    this.$justSlider = this.$html.find(".just-slider__main");
  }

  private initHandle(type: HandleType) {
    this.handles[type] = new Handle({
      type,
      $parent:      this.$justSlider,
      eventManager: this.eventManager,
    });

    this.handles[type].setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
  }
}

export default View;