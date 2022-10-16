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
    console.log("View created");
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
    if (orientation === "vertical") {
      this.toggleOrientation();
    }
  }

  public toggleOrientation() {
    this.$html.toggleClass("just-slider_vertical");
  }

  public initComponents() {
    this.initHandleFrom();
    this.initHandleTo();
    this.initProgressBar();
  }

  public updateHandle(options: Options, type: HandleType) {
    this.handles[type].update(options);
  }

  public updateProgressBar(options: Options) {
    this.progressBar.update(options);
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

  private initProgressBar() {
    this.progressBar = new ProgressBar(this.$justSlider);
    this.progressBar.update(this.options);
  }

  private initHandleFrom() {
    this.handles.from = new Handle({
      $parent: this.$justSlider,
      $slider: this.$html,
      type:    "from"
    });

    this.handles.from.update(this.options);
  }

  private initHandleTo() {
    const { isRange } = this.options;

    if (isRange) {
      this.handles.to = new Handle({
        $parent: this.$justSlider,
        $slider: this.$html,
        type:    "to"
      });

      this.handles.to.update(this.options);
    }
  }
}

export default View;