class InputField {
  private className: string;
  private $component: JQuery<HTMLElement>;
  private $input: JQuery<HTMLElement>;
  private options: InputFieldOptions;

  constructor($parent: JQuery<HTMLElement>, options: InputFieldOptions = {}) {
    this.className = 'input-field';
    this.options = options;
    this.$component = $parent.find(`.js-${this.className}`);
    this.$input = this.$component.find(`.js-${this.className}__input`);
    this.render();
  }

  public disable(): void {
    this.$component.addClass(`${this.className}_disabled`);
    this.$input.prop('disabled', true);
  }

  public enable(): void {
    this.$component.removeClass(`${this.className}_disabled`);
    this.$input.prop('disabled', false);
  }

  public update({
    value,
    step,
    min,
  }: InputUpdate): void {
    if (value !== undefined) {
      this.$input.val(value);
    }

    if (step !== undefined) {
      this.$input.prop('step', step);
    }

    if (min !== undefined) {
      this.$input.prop('min', min);
    }
  }

  private render(): void {
    this.setHandlers();
  }

  private setHandlers(): void {
    this.$input.on('change.input-field', this.handleInputChange.bind(this));
  }

  private handleInputChange(event: Event): void {
    if (event.currentTarget instanceof HTMLInputElement) {
      const value = Number(event.currentTarget.value);
      const { handleInputChange } = this.options;
      handleInputChange?.(value);
    }
  }
}

export default InputField;
