import EventManager from "../EventManager/EventManager";
import Handle       from "./Handle/Handle";
import ProgressBar  from "./ProgressBar/ProgressBar";
import Scale        from "./Scale/Scale";

import {
  State,
  Orientation,
} from "../types";

import { convertViewPositionToModel } from "./utilities/utilities";

class View {
  private eventManager: EventManager;
  private state:        State;
  private $html:        JQuery<HTMLElement>;
  private $justSlider:  JQuery<HTMLElement>;

  private handleHandleMousemove: (position: number, type: HandleType) => void;
  private sliderClickHandler:    (position: number, type: HandleType) => void;
  private scaleClickHandler:     (position: number, type: HandleType) => void;

  private handles: {
    from: Handle,
    to:   Handle,
  };

  private progressBar: ProgressBar;
  private scale:       Scale;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  }

  public getHtml(): JQuery<HTMLElement> {
    return this.$html;
  }

  public init(state: State): void {
    this.state   = state;
    this.handles = { from: undefined, to: undefined };
    this.initHtml();
  }

  public setOrientation(orientation: Orientation): void {
    if (orientation === "vertical") {
      this.$html.addClass("just-slider_vertical");
      return;
    }

    this.$html.removeClass("just-slider_vertical");
  }

  public initComponents(): void {
    this.initHandle("from");
  }

  public updateHandleFrom(state: State): void {
    this.handles.from.update(state);
  }

  public updateHandleTo(state: State): void {
    const { range } = state;

    if (range) {
      if (!this.handles.to) {
        this.initHandle("to");
      }

      this.handles.to.update(state);
      return;
    }

    if (!this.handles.to) return;
    
    this.deleteHandle("to");
  }

  public deleteHandle(type: HandleType): void {
    this.handles[type]?.delete();
    delete this.handles[type];
  }

  public addCreateHandleHandlers(handler: (value: number, type: HandleType) => void): void {
    this.handleHandleMousemove = (position, type) => {
      const converted = this.getConvertedPosition(position);
      handler(converted, type);
    }
  }

  public updateTooltips(state: State): void {
    this.handles.from?.updateTooltip(state);
    this.handles.to?.updateTooltip(state);
  }

  public updateProgressBar(state: State): void {
    const { progressBar } = state;

    if (progressBar) {
      if (!this.progressBar) {
        this.progressBar = new ProgressBar(this.$justSlider);
      }

      this.progressBar.update(state);
      return;
    }

    if (!this.progressBar) return;

    this.deleteProgressBar();
  }

  public deleteProgressBar(): void {
    this.progressBar?.delete();
    delete this.progressBar;
  }

  public updateScale(state: State): void {
    const { scale } = state;

    if (scale) {
      if (!this.scale) {
        this.scale = new Scale(this.$html);
        this.scale.setNumberClickHandler(this.scaleClickHandler?.bind(this));
      }

      this.scale.update(state);
      return;
    }

    if (!this.scale) return;

    this.deleteScale();
  }

  public deleteScale(): void {
    this.scale?.delete();
    delete this.scale;
  }

  public addCreateScaleClickHandler(handler: (value: number, type: HandleType) => void): void {
    this.scaleClickHandler = (position) => {
      const closestHandle = this.getClosestHandle(position);
      handler(position, closestHandle);
    }
  }

  public addCreateSliderClickHandler(handler: (value: number, type: HandleType) => void): void {
    this.sliderClickHandler = handler;
  }

  public setSliderClickHandler(): void {
    this.$html.addClass("just-slider_animated");
    this.$justSlider.on("mousedown.slider", this.handleSliderClick.bind(this));
  }

  public removeSliderClickHandler(): void {
    this.$html.removeClass("just-slider_animated");
    this.$justSlider.off("mousedown.slider");
  }

  private initHandle(type: HandleType): void {
    this.handles[type] = new Handle({
      type,
      $parent:      this.$justSlider,
      eventManager: this.eventManager,
    });

    this.handles[type].setHandleMousemoveHandler(this.handleHandleMousemove.bind(this));
  }

  private handleSliderClick(event: MouseEvent): void {
    const position = this.state.orientation === "horizontal" ? event.pageX : event.pageY;

    const converted     = this.getConvertedPosition(position);
    const closestHandle = this.getClosestHandle(converted);

    this.sliderClickHandler(converted, closestHandle);
  }

  private getClosestHandle(position: number): HandleType {
    const { from, to, range } = this.state;

    const distanceToTo   = Math.abs(to - position);
    const distanceToFrom = Math.abs(from - position);
    const type           = distanceToTo > distanceToFrom || !range ? "from" : "to";

    return type;
  }

  private getConvertedPosition(position: number): number {
    const { min, max, orientation, direction } = this.state;

    const length = orientation === "horizontal" ? this.$justSlider.width() : this.$justSlider.height();
    const shift  = orientation === "horizontal" ? this.$justSlider.offset().left : this.$justSlider.offset().top;

    const converted = convertViewPositionToModel({
      position,
      min,
      max,
      orientation,
      direction,
      length,
      shift,
    });

    return converted;
  }

  private initHtml(): void {
    this.$html = $(`
      <div class="just-slider">
        <div class="just-slider__main">
        </div>
      </div>
    `);

    this.$justSlider = this.$html.find(".just-slider__main");
  }
}

export default View;