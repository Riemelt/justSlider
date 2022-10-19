class InputField {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private $input: JQuery<HTMLElement>;

  constructor($parent: JQuery<HTMLElement>) {
    this.className = "input-field";
    this.init($parent);
  }

  private init($parent: JQuery<HTMLElement>) {
    this.$component = $parent.find(`.js-${this.className}`);
    this.$input     = this.$component.find(`.js-${this.className}__input`);

  }
}

export default InputField;