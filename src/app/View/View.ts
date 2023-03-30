import EventManager from '../EventManager/EventManager';
import {
  State,
  Orientation,
} from '../types';
import {
  HandleType, TooltipType,
} from '../Model/types';
import {
  FROM,
  HORIZONTAL,
  RANGE,
  TO,
  VERTICAL,
} from '../Model/constants';
import {
  checkCollision,
  convertViewPositionToModel,
  getElementPos,
} from '../utilities/utilities';
import Handle from './Handle/Handle';
import ProgressBar from './ProgressBar/ProgressBar';
import Scale from './Scale/Scale';
import Tooltip from './Tooltip/Tooltip';

class View {
  private eventManager: EventManager;
  private state: State;
  private $component: JQuery<HTMLElement>;
  private $justSlider: JQuery<HTMLElement>;
  private $parent: JQuery<HTMLElement>;
  private margin = 0;

  private handleHandlePointermove?: (
    position: number,
    type: HandleType,
    isConverted?: boolean
  ) => void;
  private sliderClickHandler?: (position: number, type: HandleType) => void;
  private scaleClickHandler?: (position: number) => void;

  private handles: {
    from?: Handle,
    to?: Handle,
  } = {};

  private tooltips: {
    from?: Tooltip,
    to?: Tooltip,
    range?: Tooltip,
  } = {};

  private progressBar?: ProgressBar;
  private scale?: Scale;

  static initHtml(): JQuery<HTMLElement> {
    return $(`
      <div class="just-slider">
        <div class="just-slider__main">
        </div>
      </div>
    `);
  }

  static isSliderBar($element: JQuery<HTMLElement>): boolean {
    return $element.is('.just-slider__main') ||
      $element.is('.just-slider__progress-bar-wrapper') ||
      $element.is('.just-slider__progress-bar');
  }

  constructor(
    eventManager: EventManager,
    state: State,
    $parent: JQuery<HTMLElement>,
  ) {
    this.eventManager = eventManager;
    this.state = state;
    this.$parent = $parent;
    this.$component = View.initHtml();
    this.$justSlider = this.$component.find('.just-slider__main');
    this.setHandlers();
  }

  public getHtml(): JQuery<HTMLElement> {
    return this.$component;
  }

  public init(state: State): void {
    this.state = state;
  }

  public setOrientation(orientation: Orientation): void {
    if (orientation === VERTICAL) {
      this.$component.addClass('just-slider_vertical');
      return;
    }

    this.$component.removeClass('just-slider_vertical');
  }

  public initComponents(): void {
    this.initHandle(FROM);
  }

  public updateHandle(state: State, type: HandleType): void {
    if (type === FROM) {
      this.updateHandleFrom(state);
      return;
    }

    this.updateHandleTo(state);
  }

  public deleteHandle(type: HandleType): void {
    this.handles[type]?.delete();
    delete this.handles[type];
  }

  public swapHandles(): void {
    const { from, to } = this.handles;

    if (from !== undefined && to !== undefined) {
      this.handles = {
        from: to,
        to: from,
      };

      this.handles.from?.setType(FROM);
      this.handles.to?.setType(TO);
    }
  }

  public addCreateHandleHandlers(handler: (
    value: number,
    type: HandleType
  ) => void): void {
    this.handleHandlePointermove = (position, type, isConverted = false) => {
      const converted = isConverted ?
        position :
        this.getConvertedPosition(position);

      handler(converted, type);
    };
  }

  public updateTooltips(state: State): void {
    this.updateTooltip(FROM, state);
    this.updateTooltip(TO, state);
    this.updateTooltip(RANGE, state);

    this.fixTooltipsVisuals();
  }

  public updateTooltip(type: TooltipType, state: State): void {
    const { tooltips, range } = state;
    const isWithRange = (type === TO || type === RANGE) && range;
    const shouldUpdate = tooltips && (type === FROM || isWithRange);

    if (shouldUpdate) {
      if (!this.tooltips[type]) {
        this.tooltips[type] = new Tooltip({
          type,
          state,
          $parent: this.$justSlider,
        });
      }

      this.tooltips[type]?.update(state);
      return;
    }

    if (!this.tooltips[type]) return;

    this.deleteTooltip(type);
  }

  private deleteTooltip(type: TooltipType): void {
    this.tooltips[type]?.delete();
    delete this.tooltips[type];
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
        this.initScale();
      }

      this.scale?.update(state);
      this.fixScaleVisuals();
      return;
    }

    if (!this.scale) return;

    this.deleteScale();
    this.addMarginIfRequired();
  }

  public deleteScale(): void {
    this.scale?.delete();
    delete this.scale;
  }

  public addCreateScaleClickHandler(handler: (
    value: number,
    type: HandleType
  ) => void): void {
    this.scaleClickHandler = (position) => {
      const closestHandle = this.getClosestHandle(position);
      handler(position, closestHandle);
    };
  }

  public addCreateSliderClickHandler(handler: (
    value: number,
    type: HandleType
  ) => void): void {
    this.sliderClickHandler = handler;
  }

  public setSliderClickHandler(): void {
    this.$justSlider.on(
      'pointerdown.slider',
      this.handleSliderClick.bind(this)
    );
  }

  public removeSliderClickHandler(): void {
    this.$justSlider.off('pointerdown.slider');
  }

  private fixTooltipsVisuals(): void {
    const types: Array<TooltipType> = [FROM, TO, RANGE];
    types.forEach((type) => {
      this.tooltips[type]?.fixPosition(this.$parent);
    });

    this.fixTooltipsOnCollision();

    types.forEach((type) => {
      this.tooltips[type]?.hideIfBiggerThanContainer(this.$parent);
    });
  }

  private fixTooltipsOnCollision(): void {
    const { from, to, range } = this.state;
    const collided = this.checkTooltipsCollision();

    if (range && collided && (from !== to)) {
      this.tooltips[FROM]?.hide();
      this.tooltips[TO]?.hide();
      this.tooltips[RANGE]?.show();
      return;
    }

    this.tooltips[FROM]?.show();
    this.tooltips[TO]?.show();
    this.tooltips[RANGE]?.hide();
  }

  private checkTooltipsCollision(): boolean {
    const $from = this.tooltips[FROM]?.$getHtml();
    const $to = this.tooltips[TO]?.$getHtml();

    if ($from === undefined || $to === undefined) {
      return false;
    }

    return checkCollision($from, $to);
  }

  private fixScaleVisuals(): void {
    this.addMarginIfRequired();
    this.scale?.hideSegmentsOnCollision();
    this.scale?.hideIfBiggerThanContainer(this.$parent);
  }

  private addMarginIfRequired(): void {
    let newMargin = 0;

    if (this.scale === undefined ||
      this.state.orientation === VERTICAL ||
      this.state.scale?.numbers === false
    ) {
      this.setMargin(newMargin);
      return;
    }

    newMargin = this.scale.getRequiredMargin(this.$parent, this.margin);
    this.setMargin(newMargin);
  }

  private setMargin(margin: number) {
    this.margin = margin;
    this.$component.css('margin-left', `${margin}px`);
    this.$component.css('margin-right', `${margin}px`);
  }

  private fixVisualsOnResize(): void {
    this.fixTooltipsVisuals();
    this.scale?.hideSegmentsOnCollision();
    this.scale?.hideIfBiggerThanContainer(this.$parent);
  }

  private setHandlers(): void {
    $(window).on('resize.slider', this.fixVisualsOnResize.bind(this));
    jQuery(() => {
      this.fixScaleVisuals();
      this.fixTooltipsVisuals();
    });
  }

  private initScale(): void {
    this.scale = new Scale(this.$component, this.state);

    if (this.scaleClickHandler !== undefined) {
      this.scale.setNumberClickHandler(this.scaleClickHandler.bind(this));
    }
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
      $parent: this.$justSlider,
      eventManager: this.eventManager,
      state: this.state,
    });

    if (this.handleHandlePointermove !== undefined) {
      const handler = this.handleHandlePointermove.bind(this);
      this.handles[type]?.setHandlePointermoveHandler(handler);
    }
  }

  private handleSliderClick(event: JQuery.Event & {
    target: HTMLElement,
  }): void {
    const $element = $(event.target);

    if (!View.isSliderBar($element)) {
      return;
    }

    const {
      pageX = 0,
      pageY = 0,
    } = event;

    const position = this.state.orientation === HORIZONTAL ? pageX : pageY;

    const converted = this.getConvertedPosition(position);
    const closestHandle = this.getClosestHandle(converted);

    this.sliderClickHandler?.(converted, closestHandle);
  }

  private getClosestHandle(position: number): HandleType {
    const { from, to, range } = this.state;

    const distanceToTo = Math.abs(to - position);
    const distanceToFrom = Math.abs(from - position);
    const type = distanceToTo > distanceToFrom || !range ? FROM : TO;

    return type;
  }

  private getConvertedPosition(position: number): number {
    const { min, max, orientation, direction } = this.state;

    const length = (orientation === HORIZONTAL ?
      this.$justSlider.width() :
      this.$justSlider.height()) ?? 0;
    const shift = getElementPos(this.$justSlider, orientation);

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
}

export default View;
