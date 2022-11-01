class InputField {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private $input: JQuery<HTMLElement>;
  private options: InputFieldOptions;

  constructor($parent: JQuery<HTMLElement>, options: InputFieldOptions) {
    this.className = "input-field";
    this.init($parent, options);
    this.render();
  }

  public disable() {
    this.$component.addClass(`${this.className}_disabled`);
    this.$input.prop("disabled", true);
  }

  public enable() {
    this.$component.removeClass(`${this.className}_disabled`);
    this.$input.prop("disabled", false);
  }

  public update(value: number, step?: number) {
    this.$input.val(value);

    if (step === undefined) return;

    this.$input.prop("step", step);
  }

  private init($parent: JQuery<HTMLElement>, options: InputFieldOptions) {
    this.options = options;
    this.$component = $parent.find(`.js-${this.className}`);
    this.$input     = this.$component.find(`.js-${this.className}__input`);
  }

  private render() {
    this.setHandlers();
  }

  private setHandlers() {
    this.$input.on("change.input-field", this.handleInputChange.bind(this));
  }

  private handleInputChange(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      const value = Number(event.currentTarget.value);
      const { handleInputChange } = this.options;
      handleInputChange?.(value);
    }
  }
}

export default InputField;