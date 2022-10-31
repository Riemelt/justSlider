import InputField from "../input-field";
import Toggle from "../toggle";

class ConfigurationPanel {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private options: ConfigurationPanelOptions

  constructor($parent: JQuery<HTMLElement>, options: ConfigurationPanelOptions) {
    this.className = "configuration-panel";
    this.init($parent, options);
  }

  private init($parent: JQuery<HTMLElement>, options: ConfigurationPanelOptions) {
    this.$component = $parent.find(`.js-${this.className}`);
    new InputField(this.$component.find(`.js-${this.className}__input-min`), options.inputMin);
    new InputField(this.$component.find(`.js-${this.className}__input-max`), options.inputMax);
    new InputField(this.$component.find(`.js-${this.className}__input-step`), options.inputStep);
    new InputField(this.$component.find(`.js-${this.className}__input-from`), options.inputFrom);
    new InputField(this.$component.find(`.js-${this.className}__input-to`), options.inputTo);

    new Toggle(this.$component.find(`.js-${this.className}__toggle-vertical`));
    new Toggle(this.$component.find(`.js-${this.className}__toggle-range`));
    new Toggle(this.$component.find(`.js-${this.className}__toggle-bar`));
    new Toggle(this.$component.find(`.js-${this.className}__toggle-tooltip`));
  }
}

export default ConfigurationPanel;