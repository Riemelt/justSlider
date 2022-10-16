import Handle      from "./Handle/Handle";
import ProgressBar from "./ProgressBar/ProgressBar";

class View {
  private options: Options;
  private $html: JQuery<HTMLElement>;
  private $justSlider: JQuery<HTMLElement>;
  private handleHandleMousemove: (position: number, type: HandleType) => void;

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

  private initHtml() {
    this.$html = $(`
      <div class="just-slider">
        <div class="just-slider__main">
        </div>
      </div>
    `);

    this.$justSlider = this.$html.find(".just-slider__main");
  }

  private initProgressBar() {
    this.progressBar = new ProgressBar(this.$justSlider);
    this.progressBar.update(this.options);
  }

  private initHandleFrom() {
    this.handles.from = new Handle(this.$justSlider, "from");
    this.handles.from.update(this.options);
  }

  private initHandleTo() {
    const { isRange } = this.options;

    if (isRange) {
      this.handles.to = new Handle(this.$justSlider, "to");
      this.handles.to.update(this.options);
    }
  }
}

export default View;