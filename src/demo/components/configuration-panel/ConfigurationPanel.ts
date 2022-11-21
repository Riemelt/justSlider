import { Options } from "../../../app/types";
import InputField from "../input-field";
import Toggle from "../toggle";

class ConfigurationPanel {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private options: ConfigurationPanelOptions;

  private inputMin:  InputField;
  private inputMax:  InputField;
  private inputStep: InputField;
  private inputFrom: InputField;
  private inputTo:   InputField;

  private toggleVertical: Toggle;
  private toggleForward:  Toggle;
  private toggleRange:    Toggle;
  private toggleBar:      Toggle;
  private toggleTooltip:  Toggle;

  private inputScaleDensity:  InputField;
  private toggleScale:        Toggle;
  private toggleScaleType:    Toggle;
  private toggleScaleNumbers: Toggle;
  private toggleScaleLines:   Toggle;

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
    scale,
  }: Options) {
    this.inputFrom.update({ step, min, value: from });

    if (range) {
      this.inputTo.enable();
      this.inputTo.update({ step, min, value: to });
    } else {
      this.inputTo.disable();
    }

    this.inputStep.update({ value: step });
    this.inputMin.update({ value: min });
    this.inputMax.update({ value: max });

    this.toggleVertical.update(orientation === "vertical");
    this.toggleForward.update(direction === "forward");
    this.toggleBar.update(progressBar);
    this.toggleRange.update(range);
    this.toggleTooltip.update(tooltips);
    this.toggleScale.update(scale !== null);

    if (scale === null) {
      this.inputScaleDensity.disable();
      this.toggleScaleType.disable();
      this.toggleScaleNumbers.disable();
      this.toggleScaleLines.disable();
    } else {
      this.inputScaleDensity.enable();
      this.toggleScaleType.enable();
      this.toggleScaleNumbers.enable();
      this.toggleScaleLines.enable();

      this.inputScaleDensity.update({ value: scale.density });
      this.toggleScaleType.update(scale.type === "steps");
      this.toggleScaleNumbers.update(scale.numbers);
      this.toggleScaleLines.update(scale.lines);
    }
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
    this.toggleScale    = new Toggle(this.$component.find(`.js-${this.className}__toggle-scale`), options.toggleScale);

    this.inputScaleDensity  = new InputField(this.$component.find(`.js-${this.className}__scale-density`), options.scale.inputDensity);
    this.toggleScaleType    = new Toggle(this.$component.find(`.js-${this.className}__scale-type`), options.scale.toggleType);
    this.toggleScaleNumbers = new Toggle(this.$component.find(`.js-${this.className}__scale-numbers`), options.scale.toggleNumbers);
    this.toggleScaleLines   = new Toggle(this.$component.find(`.js-${this.className}__scale-lines`), options.scale.toggleLines);
  }
}

export default ConfigurationPanel;