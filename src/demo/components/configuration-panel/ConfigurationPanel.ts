import InputField from "../input-field";
import Toggle from "../toggle";

class ConfigurationPanel {
  private className: string;
  private $component: JQuery<HTMLElement>;

  constructor($parent: JQuery<HTMLElement>) {
    this.className = "configuration-panel";
    this.init($parent);
  }

  private init($parent: JQuery<HTMLElement>) {
    this.$component = $parent.find(`.js-${this.className}`);
    new InputField(this.$component.find(`.js-${this.className}__input-min`));
    new InputField(this.$component.find(`.js-${this.className}__input-max`));
    new InputField(this.$component.find(`.js-${this.className}__input-step`));
    new InputField(this.$component.find(`.js-${this.className}__input-from`));
    new InputField(this.$component.find(`.js-${this.className}__input-to`));

    new Toggle(this.$component.find(`.js-${this.className}__toggle-vertical`));
    new Toggle(this.$component.find(`.js-${this.className}__toggle-range`));
    new Toggle(this.$component.find(`.js-${this.className}__toggle-bar`));
    new Toggle(this.$component.find(`.js-${this.className}__toggle-tooltip`));
  }
}

export default ConfigurationPanel;