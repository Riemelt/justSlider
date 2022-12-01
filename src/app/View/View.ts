import EventManager from "../EventManager/EventManager";
import {
  State,
  Orientation,
} from "../types";
import {
  HandleType,
} from "../Model/types";
import {
  FROM,
  HORIZONTAL,
  TO,
  VERTICAL,
} from "../Model/constants";
import {
  convertViewPositionToModel,
} from "./utilities/utilities";
import Handle       from "./Handle/Handle";
import ProgressBar  from "./ProgressBar/ProgressBar";
import Scale        from "./Scale/Scale";

class View {
  private eventManager: EventManager;
  private state:        State;
  private $component:   JQuery<HTMLElement>;
  private $justSlider:  JQuery<HTMLElement>;

  private handleHandlePointermove: (position: number, type: HandleType, isConverted?: boolean) => void = () => { return; };
  private sliderClickHandler:      (position: number, type: HandleType) => void = () => { return; };
  private scaleClickHandler:       (position: number) => void = () => { return; };

  private handles: {
    from?: Handle,
    to?:   Handle,
  } = {};

  private progressBar?: ProgressBar;
  private scale?:       Scale;

  constructor(eventManager: EventManager, state: State) {
    this.eventManager = eventManager;
    this.state        = state;
    this.$component   = this.initHtml();
    this.$justSlider  = this.$component.find(".just-slider__main");
  }

  public getHtml(): JQuery<HTMLElement> {
    return this.$component;
  }

  public init(state: State): void {
    this.state = state;
  }

  public setOrientation(orientation: Orientation): void {
    if (orientation === VERTICAL) {
      this.$component.addClass("just-slider_vertical");
      return;
    }

    this.$component.removeClass("just-slider_vertical");
  }

  public initComponents(): void {
    this.initHandle(FROM);
  }

  public updateHandle(state: State, type: HandleType): void {
    const update = type === FROM ? this.updateHandleFrom.bind(this) : this.updateHandleTo.bind(this);
    update(state);
  }

  public deleteHandle(type: HandleType): void {
    this.handles[type]?.delete();
    delete this.handles[type];
  }

  public addCreateHandleHandlers(handler: (value: number, type: HandleType) => void): void {
    this.handleHandlePointermove = (position, type, isConverted = false) => {
      const converted = isConverted ? position : this.getConvertedPosition(position);
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
        this.scale = new Scale(this.$component);
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
    this.$component.addClass("just-slider_animated");
    this.$justSlider.on("pointerdown.slider", this.handleSliderClick.bind(this));
  }

  public removeSliderClickHandler(): void {
    this.$component.removeClass("just-slider_animated");
    this.$justSlider.off("pointerdown.slider");
  }

  private updateHandleFrom(state: State): void {
    this.handles.from?.update(state);
  }

  private updateHandleTo(state: State): void {
    const { range } = state;

    if (range) {
      if (!this.handles.to) {
        this.initHandle(TO);
      }

      this.handles.to?.update(state);
      return;
    }

    if (!this.handles.to) return;
    
    this.deleteHandle(TO);
  }

  private initHandle(type: HandleType): void {
    this.handles[type] = new Handle({
      type,
      $parent:      this.$justSlider,
      eventManager: this.eventManager,
      state:        this.state,
    });

    this.handles[type]?.setHandlePointermoveHandler(this.handleHandlePointermove.bind(this));
  }

  private handleSliderClick(event: JQuery.Event): void {
    const {
      pageX = 0,
      pageY = 0,
    } = event;

    const position = this.state.orientation === HORIZONTAL ? pageX : pageY;

    const converted     = this.getConvertedPosition(position);
    const closestHandle = this.getClosestHandle(converted);

    this.sliderClickHandler(converted, closestHandle);
  }

  private getClosestHandle(position: number): HandleType {
    const { from, to, range } = this.state;

    const distanceToTo   = Math.abs(to - position);
    const distanceToFrom = Math.abs(from - position);
    const type           = distanceToTo > distanceToFrom || !range ? FROM : TO;

    return type;
  }

  private getConvertedPosition(position: number): number {
    const { min, max, orientation, direction } = this.state;

    const length = (orientation === HORIZONTAL ? this.$justSlider.width() : this.$justSlider.height()) ?? 0;
    const shift  = (orientation === HORIZONTAL ? this.$justSlider.offset()?.left : this.$justSlider.offset()?.top) ?? 0;

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

  private initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider">
        <div class="just-slider__main">
        </div>
      </div>
    `);
  }
}

export default View;