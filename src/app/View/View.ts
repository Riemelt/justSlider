import Handle      from "./Handle/Handle";
import ProgressBar from "./ProgressBar/ProgressBar";

import { convertViewPositionToModel } from "./utilities";

class View {
  private options:     Options;

  private $html:       JQuery<HTMLElement>;
  private $justSlider: JQuery<HTMLElement>;

  private handleHandleMousemove: (position: number, type: HandleType) => void;
  private sliderClickHandler:    (position: number, type: HandleType) => void;

  private handles: {
    from: Handle,
    to:   Handle,
  };

  private progressBar: ProgressBar;

  constructor() {
    //
  }

  public getHtml() {
    return this.$html;
  }

  public init(options: Options) {
    this.options = options;
    this.handles = { from: undefined, to: undefined };
    this.initHtml();
    this.initAnimation();

    const { orientation } = options;
    this.setOrientation(orientation);
  }

  public setOrientation(orientation: Orientation) {
    if (orientation === "vertical") {
      this.$html.addClass("just-slider_vertical");
      return;
    }

    this.$html.removeClass("just-slider_vertical");
  }

  public initComponents() {
    this.initHandleFrom();
    this.updateHandleTo(this.options);
    this.updateProgressBar(this.options);
  }

  public updateHandleFrom(options: Options) {
    this.handles.from.update(options);
  }

  public updateHandleTo(options: Options) {
    const { range } = options;

    if (range) {
      if (!this.handles.to) {
        this.handles.to = new Handle({
          $parent: this.$justSlider,
          $slider: this.$html,
          type:    "to"
        });
      }

      this.handles.to.update(options);
      return;
    }

    if (!this.handles.to) return;
    
    this.deleteHandle("to");
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
    
    this.handles.from?.setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
    this.handles.to?.setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
  }

  public addCreateSliderClickHandler(handler: (value: number, type: HandleType) => void) {
    this.sliderClickHandler = handler;
    this.$justSlider.on("click.slider", this.handleSliderClick.bind(this));
  }

  private handleSliderClick(event: MouseEvent) {
    const position = this.options.orientation === "horizontal" ? event.pageX : event.pageY;
    const { min, max, orientation, direction, from, to } = this.options;

    const converted = convertViewPositionToModel({
      position,
      min,
      max,
      orientation,
      direction,
      $context: this.$justSlider,
    });

    const distanceToTo = Math.abs(to - converted);
    const distanceToFrom = Math.abs(from - converted);
    const type = distanceToTo > distanceToFrom ? "from" : "to";

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

  private initAnimation() {
    this.$html.addClass("just-slider_animated");
  }

  private initHandleFrom() {
    this.handles.from = new Handle({
      $parent: this.$justSlider,
      $slider: this.$html,
      type:    "from"
    });

    this.handles.from.update(this.options);
  }
}

export default View;