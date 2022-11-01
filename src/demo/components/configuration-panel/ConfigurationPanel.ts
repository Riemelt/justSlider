import { Options } from "../../../app/types";
import InputField from "../input-field";
import Toggle from "../toggle";

class ConfigurationPanel {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private options: ConfigurationPanelOptions;

  private inputMin: InputField;
  private inputMax: InputField;
  private inputStep: InputField;
  private inputFrom: InputField;
  private inputTo: InputField;

  private toggleVertical: Toggle;
  private toggleForward: Toggle;
  private toggleRange: Toggle;
  private toggleBar: Toggle;
  private toggleTooltip: Toggle;

  constructor($parent: JQuery<HTMLElement>, options: ConfigurationPanelOptions) {
    this.className = "configuration-panel";
    this.init($parent, options);
  }

  public update({
    from,
    to,
    min,
    max,
    step,
    orientation,
    direction,
    progressBar,
    tooltips,
    range,
  }: Options) {
    this.inputFrom.update(from);
    this.inputTo.update(to);
    this.inputStep.update(step);
    this.inputMin.update(min);
    this.inputMax.update(max);

    this.toggleVertical.update(orientation === "vertical");
    this.toggleForward.update(direction === "forward");
    this.toggleBar.update(progressBar);
    this.toggleRange.update(range);
    this.toggleTooltip.update(tooltips);
  }

  private init($parent: JQuery<HTMLElement>, options: ConfigurationPanelOptions) {
    this.$component     = $parent.find(`.js-${this.className}`);

    this.inputMin       = new InputField(this.$component.find(`.js-${this.className}__input-min`), options.inputMin);
    this.inputMax       = new InputField(this.$component.find(`.js-${this.className}__input-max`), options.inputMax);
    this.inputStep      = new InputField(this.$component.find(`.js-${this.className}__input-step`), options.inputStep);
    this.inputFrom      = new InputField(this.$component.find(`.js-${this.className}__input-from`), options.inputFrom);
    this.inputTo        = new InputField(this.$component.find(`.js-${this.className}__input-to`), options.inputTo);

    this.toggleVertical = new Toggle(this.$component.find(`.js-${this.className}__toggle-vertical`), options.toggleVertical);
    this.toggleForward  = new Toggle(this.$component.find(`.js-${this.className}__toggle-forward`), options.toggleForward);
    this.toggleRange    = new Toggle(this.$component.find(`.js-${this.className}__toggle-range`), options.toggleRange);
    this.toggleBar      = new Toggle(this.$component.find(`.js-${this.className}__toggle-bar`), options.toggleBar);
    this.toggleTooltip  = new Toggle(this.$component.find(`.js-${this.className}__toggle-tooltip`), options.toggleTooltip);
  }
}

export default ConfigurationPanel;