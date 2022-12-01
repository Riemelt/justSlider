class Toggle {
  private className:  string;
  private $component: JQuery<HTMLElement>;
  private $input:     JQuery<HTMLElement>;
  private options:    ToggleOptions;

  constructor($parent: JQuery<HTMLElement>, options: ToggleOptions = {}) {
    this.className  = "toggle";
    this.options    = options;
    this.$component = $parent.find(`.js-${this.className}`);
    this.$input     = this.$component.find(`.js-${this.className}__switch-input`);
    this.render();
  }

  public disable(): void {
    this.$component.addClass(`${this.className}_disabled`);
    this.$input.prop("disabled", true);
  }

  public enable(): void {
    this.$component.removeClass(`${this.className}_disabled`);
    this.$input.prop("disabled", false);
  }

  public update(checked: boolean): void {
    this.$input.prop("checked", checked);
  }

  private render(): void {
    this.setHandlers();
  }

  private setHandlers(): void {
    this.$input.on("change.toggle", this.handleToggleChange.bind(this));
  }

  private handleToggleChange(event: Event): void {
    if (event.currentTarget instanceof HTMLInputElement) {
      const { checked } = event.currentTarget;
      const { handleToggleChange } = this.options;
      handleToggleChange?.(checked);
    }
  }
}

export default Toggle;